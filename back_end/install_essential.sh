# echo "If this fails please ensure pip3 is installed."


type mysql >/dev/null 2>&1 && echo "MySQL is installed." || echo "Please install mysql using 'sudo apt update -y && sudo apt install -y mysql-server'"



# pip packages
pip3 install Flask-SocketIO mysql-connector-python flask-cors pandas
