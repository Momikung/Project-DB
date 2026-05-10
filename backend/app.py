from flask import Flask
from flask_cors import CORS
from src.init import register_blueprints

app = Flask(__name__)
CORS(app)

# Initialize Components
register_blueprints(app)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
