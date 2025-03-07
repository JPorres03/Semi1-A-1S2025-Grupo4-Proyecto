# LANZAR

Se necesita tener instalado python y pip, procede a crear un entorno virtual en la raiz de la API

```
python -m venv venv
```
activar el entorno virtual
```
<!-- LINUX -->
source ven/bin/activate

<!-- WINDOWS -->
venv/Scripts/activate
```

Intalar dependencias
```
pip install -r requirements.txt
```
Ejecutar 
```
python run.py
```
# LEVANTAR EC2

```
sudo apt update
sudo apt install python3 python3-pip python3-venv git unzip -y

git clone tu-repositorio-git

python3 -m venv venv

source venv/bin/activate

sudo apt-get update
sudo apt-get install libpq-dev python3-dev

pip install -r requirements.txt

python3 run.py
```