from proximity import db
from pymongo import GEOSPHERE

""" Database CRUD methods """

""" 
    User data structure:
    user {
        '_id': '5446a4539fd1ad339e8e286b',      ObjectId        MongoDB-generated internal ID for DB Document
        'uid': 1,                               long            Unique ID, used throughout app
        'name': u'TestUser1',                   str             Username
        'pass': 'e6c...349,                     str             Password (stored as hash)
        'age': 25,                              int             Age
        'gender': 'm',                          char (m/f)      Gender
        'looking_for_m': 0,                     bool (0/1)      Looking for men?
        'looking_for_f': 1,                     bool (0/1)      Looking for women?
        'loc': [3.91,51.01]                     [float,float]   [Longtitude,Latitude]
    },
"""

""" Main data functions """

""" Clear all user documents in the DB and reset UID sequence. """
def clear_db():
    db.users.drop_indexes()
    db.users.remove()
    db.seq.update({'_id':'uid'}, {'$set':{'val':0}})


""" Prepare DB from initial state. """
def init_db():
    db.users.create_index([("loc", GEOSPHERE)])

""" Defines the filter on which fields to return. Hides _id and password fields which should never be sent outside. """
def fields_filter():
    return {'_id': False, 'pass': False}


""" Get all users in the DB. """
def get_users():
    return list(db.users.find(fields=fields_filter()))


""" Find a single user via UserID. """
def find_user(uid):
    return db.users.find_one(spec_or_id={'uid': uid}, fields=fields_filter())


""" Find users near a coordinate and within a certain distance. """
def find_users_near(ln, lt, distance):
    return list(db.users.find(
        fields=fields_filter(), 
        spec={
            'loc': {
                '$near': {
                    '$geometry': {
                        'type': 'Point',
                        'coordinates': [ln, lt]
                    },
                    '$maxDistance': distance
                }
            }
        }
    ))


""" Create or update a user. 
    If a UserID is present, the user is updated. 
    If no UserID is present but a name/pass combo is found in the DB, the user is updated.
    Otherwise, the user is created. """
def create_or_update_user(user):
    if 'uid' in user:
        update_user(user['uid'], user)

    elif 'name' in user and 'pass' in user:
        db_user = db.users.find_one(
            spec_or_id={'name': user['name'], 'pass': user['pass']}, 
            fields=fields_filter())
        
        if db_user == None:
            return create_user(user)
        else:
            update_user(db_user['uid'], user)
    
    else:
        return create_user(user)

""" Creates a new user. Generates a new UserID in the process. """
def create_user(user):
    uid = generate_uid()
    user['uid'] = uid
    user_id = db.users.insert(user)
    print('User stored with ID: [%s] for UID [%s]' % (user_id, uid))
    return uid


""" Update info for a user (found via UserID). Does not return anything, NotFound logic is handled in controller. """
def update_user(uid, user):    
    """ Ensure UserID is never updated by removing it. """
    if 'uid' in user:
        del user['uid']
    
    db.users.update({'uid': uid}, {'$set': user})
    


""" Helper functions """

""" Generate a new UserID via the sequence stored in the DB. """
def generate_uid():
    """ Straightforward ID generation of "highest + 1" """
    latest_uid = db.seq.find_one({'_id': 'uid'})
    if latest_uid == None:
        """ None == No result """
        """ First time we generate a uid, create "sequences" collection """
        db.seq.insert({
            '_id': 'uid',
            'val': 0
        })
    
    next = db.seq.find_and_modify(
        query={'_id': 'uid'},
        update={'$inc': {'val': 1}},
        new=True
    )
    if next == None:
        print('Error generating new UserID')
        return -1
    else:
        print('New UserID generated: [%s]' % next['val'])
        return next['val']

















