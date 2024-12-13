import json


from flask import Response, request
from flask_restful import Resource

from models import db
from models.post import Post
from views import get_authorized_user_ids, can_view_post

def get_path():
    return request.host_url + "api/posts/"

class PostListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        # giving you the beginnings of this code (as this one is a little tricky for beginners):
        ids_for_me_and_my_friends = get_authorized_user_ids(self.current_user)
      
        try: 
            limit = int (request.args.get("limit", 20))
            
            if limit > 50:
                return Response(
                    json.dumps({"message": "The limit is 50"}), 
                    mimetype="application/json", 
                    status=200
                )
        except:
            return Response(
                json.dumps({"message": "The limit must be an integer between 1 and 50"}), 
                mimetype="application/json", 
                status=404
            )
        
        posts = Post.query.filter(Post.user_id.in_(ids_for_me_and_my_friends)
        ).limit(limit)

        # add the ability to handle the "limit" query parameter:
        data = [item.to_dict(user=self.current_user) for item in posts.all()]
        return Response(json.dumps(data), mimetype="application/json", status=200)

    def post(self):
        # If the user has given me the required data, I will create a new Post record in the 
        # "posts" table
        # Required param: image_url
        # Optional: caption, alt_text

        data = request.json
        print(data)
        image_url = data.get("image_url")
        caption = data.get("caption")
        alt_text = data.get("alt_text")

        if not image_url:
            return Response(
                json.dumps({"message": "image_url is a required parameter"}),
                mimetype="application/json",
                status=400,
            )

        # 1. Create: 
        new_post = Post(
            image_url=image_url, 
            user_id=self.current_user.id, # Must be a valid user_id or will throw an error
            caption=caption,
            alt_text=alt_text
        )
        db.session.add(new_post) # Issues the insert statement
        db.session.commit() # Commits the change to the database

        # 1. Validate the data
        # 2. Insert it into the db
        # 3. Return the newly created DB resource back to the user with a 201 code
        return Response(
            json.dumps(new_post.to_dict(user=self.current_user)), 
            mimetype="application/json", 
            status=201)


class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def patch(self, id):
      
        # Add PATCH logic...
        # 1. Fetch the resource from the database
        # 2. Get the new data from the user from the body on Postman
        # 3. Set the new values
        # 4. Save the new version on the database
        # 5. Return a post back to the user / correct+updated post
        # 6. If self.user == current.user, you're good 

        post = Post.query.get(id)

        # if post doesn't exist, send error message
        if post is None:
            return Response(
                json.dumps({"Message": f"Post id={id} not found"}),
                mimetype="application/json",
                status=404,
            )
        # if post not owned by the logged in user, send error message
        if post.user_id != self.current_user.id:
            return Response(
                json.dumps({"Message": f"You are not allowed to modify post id={id}"}),
                mimetype="application/json",
                status=404,
            )
        # We're now ready to modify post because we know the user is authorized
        data = request.json
        print(data)
        caption = data.get("caption")
        image_url = data.get("image_url")
        alt_text = data.get("alt_text")

        if caption is not None:
            post.caption = caption
        if image_url is not None:
            post.image_url = image_url
        if alt_text is not None: 
            post.alt_text = alt_text

        # to actually send these updates to the database, we need to issue a 
        # database commit command
        db.session.commit()
        
        return Response(
            json.dumps(post.to_dict(user=self.current_user)),
            mimetype="application/json",
            status=200,
        )
        
    def delete(self, id):

        post = Post.query.get(id)

        # if post doesn't exist, send error message
        if post is None:
            return Response(
                json.dumps({"Message": f"Post id={id} not found"}),
                mimetype="application/json",
                status=404,
            )
        # if post not owned by the logged in user, send error message
        if post.user_id != self.current_user.id:
            return Response(
                json.dumps({"Message": f"You are not allowed to modify post id={id}"}),
                mimetype="application/json",
                status=404,
            )
        # now do the delete
        Post.query.filter_by(id=id).delete()       
        db.session.commit()

        return Response(
                json.dumps({"message": f"Post id={id} has been successfully deleted."}),
                mimetype="application/json",
                status=200,
            )
    
    def get(self, id):
        print("POST id=", id)
        can_view = can_view_post(id, self.current_user)

        if can_view:
            post = Post.query.get(id)
            return Response(
                json.dumps(post.to_dict(user=self.current_user)),
                mimetype="application/json",
                status=200,
             )
        else:
            return Response(
                json.dumps({"Message": f"Post id={id} not found"}),
                mimetype="application/json",
                status=404,
             )


def initialize_routes(api, current_user):
    api.add_resource(
        PostListEndpoint,
        "/api/posts",
        "/api/posts/",
        resource_class_kwargs={"current_user": current_user},
    )
    api.add_resource(
        PostDetailEndpoint,
        "/api/posts/<int:id>",
        "/api/posts/<int:id>/",
        resource_class_kwargs={"current_user": current_user},
    )
