from dotenv import load_dotenv, find_dotenv
import os


dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)

class Config:
    #SQL Server
    #SQL Server con autenticación de Windows
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS') == True
