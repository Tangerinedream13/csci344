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
        print(ids_for_me_and_my_friends)
        print(request.args)
        try:
            limit = request.args.get("limit", 20)
            if limit > 50:
                return Response(
                    json.dumps({"message": "The limit is must be an integer between 1 and 50"}), 
                    mimetype="application/json", 
                    status=400
                )
        except:
            count = 20

        print("Limit:", limit)

        posts = Post.query.filter(Post.user_id.in_(ids_for_me_and_my_friends)
        ).limit(count)
        # TODO: add the ability to handle the "limit" query parameter:

        data = [item.to_dict(user=self.current_user) for item in posts.all()]
        return Response(json.dumps(data), mimetype="application/json", status=200)

    def post(self):
        # If the user has given the required data, I will create a new Post record in the 
        # "posts" table

        # Required param: image_url
        # Optional: caption, alt_text

        data = request.json
        print(data)
        image_url = data.get("image_url")
        caption = data.get("image_url")
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
            user_id=self.current_user, # Must be a valid user_id or will throw an error
            caption=caption
            alt_text=alt_text
        )
        db.session.add(new_post) # Issues the insert statement
        db.session.commit() # Commits the change to the database

        # 1. Validate the data
        # 2. Insert it into the db
        # 3. Return the newly created DB resource back to the user with a 201 code
        return Response(
            json.dumps({}), mimetype="application/json", status=201)


class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def patch(self, id):
        print("POST id=", id)
        # TODO: Add PATCH logic...
        return Response(json.dumps({}), mimetype="application/json", status=200)

    def delete(self, id):
        print("POST id=", id)

        # TODO: Add DELETE logic...
        return Response(
            json.dumps{new_post.to_dict(user=self.current_user)},
            mimetype="application/json",
            status=201,
        )

    def get(self, id):
    
        # check that the id exists in the DB
        # check that it's an integer
        # chck that the post belongs to the user or someone that the user follows
        is_authorized_and_exists = can_view = can_view_post(id, self.current_user)
        if is_authorized_and_exists:
            #query for the post and return it
            post = Post.query.get(id)
            return Response(
                json.dumps(post.to_dict(user=self.current_user)),
                mimetype="application/json",
                status=404,
            )
        else: 
            return Response(
                json.dumps({"Message": "Post id=(id) not found"}),
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
