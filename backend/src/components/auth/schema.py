from pydantic import BaseModel, Field


class Login(BaseModel):
    email: str = Field(max_length=255)
    password: str = Field(max_length=255)


class ResponseLogin(BaseModel):
    refresh_token: str
    access_token: str
    token_type: str


class User(BaseModel):
    id: int
    email: str
    name: str
