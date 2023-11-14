from rest_framework.exceptions import APIException

class InvalidCommentError(APIException):
    status_code = 400
    default_code = 'invalid_comment'
    default_detail = 'Invalid comment'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail


class InvalidCommentRatingError(APIException):
    status_code = 400
    default_code = 'invalid_comment_rating'
    default_detail = 'Invalid comment rating'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail

class CommentNotFoundError(APIException):
    status_code = 404
    default_code = 'comment_not_found'
    default_detail = 'Comment not found'

    def __init__(self, detail=None):
        self.detail = detail or self.default_detail