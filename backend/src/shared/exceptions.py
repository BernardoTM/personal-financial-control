class NotFound(Exception):
    def __init__(self, message: str):
        self.message = message


class BadRequest(Exception):
    def __init__(self, message: str):
        self.message = message


class AlreadyExists(Exception):
    def __init__(self, message: str):
        self.message = message
