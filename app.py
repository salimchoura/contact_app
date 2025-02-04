"""
    Flask server that provides CRUD APIs for the contacts app 
"""

from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

# PostgreSQL database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:121314@localhost/contacts'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define a Model
class names(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(15), nullable=False)
    last_name = db.Column(db.String(15), nullable=False)

# Define a Model
class emails(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(70), nullable=False)
    contact_id = db.Column(db.Integer)


# Create tables
with app.app_context():
    db.create_all()

#gets main page
@app.route('/', methods=['GET'])
def getHome():
    return render_template('index.html')

#gets all contacts
@app.route('/contacts', methods=['GET'])
def get_contacts():
    profiles_list = names.query.all()
    response = [{'id': profile.id, 'first_name': profile.first_name,'last_name':profile.last_name} for profile in profiles_list]
    return jsonify(response), 200

#gets all emails associated with a certain user
@app.route('/emails/<int:user_id>', methods=['GET'])
def get_contact_details(user_id):
    try:
        my_emails = emails.query.filter(emails.contact_id == user_id).all()  # Retrieve all customers with the given name
        result = [{'email': email.email,'id':email.id} for email in my_emails]
        return jsonify(result), 200
    except:
        return jsonify({'error': 'no emails'}), 404


#deletes user with corresponding user id
@app.route('/delete/<int:user_id>', methods=['DELETE'])
def delete_contact(user_id):
    my_emails = emails.query.filter(emails.contact_id == user_id).all()  # Retrieve all customers with the given name
    #deleting all emails corresponding with the user first
    if my_emails:
        for email in my_emails:
            db.session.delete(email)
    
    user = names.query.get(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

#delete emails with corresponding id
@app.route('/delete_email/<int:email_id>', methods=['DELETE'])
def delete_email(email_id):
    my_email = emails.query.get(email_id)  # Retrieve all customers with the given name
    db.session.delete(my_email)
    db.session.commit()
    return jsonify({'message': 'email deleted successfully'}), 200

#adds an email to the corresponding user
@app.route('/add_email', methods=['POST'])
def add_email():
    data = request.get_json()
    email_address = data.get('email')
    # contact_id is the id of the user
    contact_id = data.get('contact_id')

    new_email = emails(email=email_address,contact_id=contact_id)
    
    try:
        db.session.add(new_email)
        db.session.commit()
        return jsonify({'message': 'Email added successfully','id':new_email.id}), 200
    except:
        db.session.rollback()
        return jsonify({'error': 'This email is in use'}), 402

# adds a contact with the corresponding name and email
@app.route('/add_contact', methods=['POST'])
def add_contact():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    email = data.get('email')

    new_email = emails(email=email)
    try:
        db.session.add(new_email)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'This email is in use'}), 404
    
    new_profile = names(first_name=first_name,last_name=last_name)
    db.session.add(new_profile)
    db.session.flush()
    new_email.contact_id = new_profile.id
    db.session.commit()
    return jsonify({'message': 'Contact added successfully','id':new_profile.id}), 200

#updates contact with the corresponding id with the first and last name
#sent in the request
@app.route('/update_contact/<int:id>', methods=['PUT'])
def update_contact(id):
    data = request.json
    contact = names.query.get(id)

    contact.first_name = data['first_name']
    contact.last_name = data['last_name']

    db.session.commit()
    
    return jsonify({"message": "Contact updated successfully"}), 200


if __name__ == '__main__':
    app.run(debug=True)
