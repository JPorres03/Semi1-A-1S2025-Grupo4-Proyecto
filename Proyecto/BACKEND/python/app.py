from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import boto3
import hashlib
import os
import jwt
from dotenv import load_dotenv
import psycopg2
app = Flask(__name__)
CORS(app)
load_dotenv()
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Configuración de AWS Cognito
COGNITO_CLIENT_ID = os.getenv('COGNITO_CLIENT_ID')
COGNITO_USER_POOL_ID = os.getenv('COGNITO_USER_POOL_ID')
AWS_REGION = os.getenv('AWS_REGION')

client = boto3.client('cognito-idp', region_name=AWS_REGION)

# Modelo de Usuario
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    username = db.Column(db.String(150), nullable=False)
    password = db.Column(db.String(150), nullable=False)

@app.route('/', methods=['GET'])
def healt():
    return jsonify({
        'status':'Ok'
    }), 200

@app.route('/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        # Hashear la contraseña (mismo método que en TypeScript)
        hash_password = hashlib.sha256(password.encode()).hexdigest() + "D**"

        # Autenticar con Cognito
        response = client.initiate_auth(
            ClientId=COGNITO_CLIENT_ID,
            AuthFlow='USER_PASSWORD_AUTH',
            AuthParameters={
                'USERNAME': email,
                'PASSWORD': hash_password
            }
        )

        # Obtener usuario de la base de datos
        user = User.query.filter_by(email=email).first()
        if not user:
            print("Usuario no encontrado")

        # Decodificar token para obtener datos adicionales
        id_token = response['AuthenticationResult']['IdToken']
        decoded = jwt.decode(id_token, options={"verify_signature": False})

        return jsonify({
            'success': True,
            'message': 'Inicio de sesión exitoso',
            'user': {
                'email': decoded['email'],
                'name': decoded.get('name', ''),
                'userId': user.id
            }
        }), 200

    except client.exceptions.NotAuthorizedException:
        return jsonify({'success': False, 'message': 'Credenciales inválidas'}), 401
    except client.exceptions.UserNotConfirmedException:
        return jsonify({'success': False, 'message': 'Usuario no confirmado'}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data['email']
        password = data['password']
        username = data['username']

        # Validar campos requeridos
        if not all([email, password, username]):
            return jsonify({'success': False, 'message': 'Todos los campos son requeridos'}), 400

        # Hashear la contraseña
        hash_password = hashlib.sha256(password.encode()).hexdigest() + "D**"

        # Registrar en Cognito
        response = client.sign_up(
            ClientId=COGNITO_CLIENT_ID,
            Username=email,
            Password=hash_password,
            UserAttributes=[
                {'Name': 'email', 'Value': email},
                {'Name': 'name', 'Value': username},
                {'Name': 'custom:username', 'Value': username}
            ]
        )

        # Guardar en base de datos
        new_user = User(
            email=email,
            username=username,
            password=hash_password
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': f'{email} registrado correctamente',
            'userSub': response['UserSub']
        }), 201

    except client.exceptions.UsernameExistsException:
        return jsonify({'success': False, 'message': 'El usuario ya existe'}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

def handle_cognito_error(err):
    error_mapping = {
        'UserNotConfirmedException': (401, 'Usuario no confirmado'),
        'NotAuthorizedException': (401, 'Credenciales inválidas'),
        'UsernameExistsException': (409, 'El usuario ya existe')
    }
    return error_mapping.get(err.response['Error']['Code'], (400, str(err)))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=3001, debug=True)