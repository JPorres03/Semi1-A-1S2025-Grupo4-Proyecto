## Despliegue
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



```