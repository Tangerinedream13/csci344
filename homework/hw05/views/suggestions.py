import json

from flask import Response
from flask_restful import Resource

from models.user import User
from views import get_authorized_user_ids


class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    def get(self):
        suggestions_ids = get_authorized_user_ids(self.current_user)
        suggestions = User.query.filter(~User.id.in_(suggestions_ids)).limit(7).all()

        suggestions_dict = [suggestion.to_dict() for suggestion in suggestions]
        
        return Response(
            json.dumps(suggestions_dict[0:7]),
            mimetype="application/json",
            status=200,
        )


def initialize_routes(api, current_user):
    api.add_resource(
        SuggestionsListEndpoint,
        "/api/suggestions",
        "/api/suggestions/",
        resource_class_kwargs={"current_user": current_user},
    )
