# DESPLIEGE 
```bash
sudo apt update -y
sudo apt install -y git

# sdk
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 9.0 --version 9.0.100

sudo nano ~/.bashrc
# Copiar la siguiente linea al final para agregar el PATH
export PATH=$PATH:$HOME/.dotnet
# reinicia terminal
source ~/.bashrc


#Clona repo
git clone https://github.com/JPorres03/Semi1-A-1S2025-Grupo4-Practica1.git

# raiz api
cd /Semi1-A-1S2025-Grupo4-Practica1/Practica 2/BACKEND/AspNet/
#crea compilado
dotnet publish -c Release -o ./publish
# ruta compilado
cd publish
# ejecuta
dotnet AspNet.dll

```