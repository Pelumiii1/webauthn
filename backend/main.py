from fastapi import FastAPI
from pydantic import BaseModel
from webauthn import generate_registration_options, verify_registration_response, generate_authentication_options, verify_authentication_response
from webauthn.helpers import options_to_json_dict
from fastapi.middleware.cors import CORSMiddleware
from webauthn.helpers.structs import AuthenticatorSelectionCriteria, UserVerificationRequirement


class RegisterOptionsRequest(BaseModel):
    user_id: str
    email: str


class LoginOptionsRequest(BaseModel):
    user_id: str

RP_ID = "localhost"  # domain only, no protocol
RP_NAME = "My FastAPI App"
ORIGIN = "http://localhost:5173"  # frontend URL


app = FastAPI(title="Webauthn API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def hello_world():
    return {"message":"Hello, world!"}



@app.post("/auth/register/options")
def register_options(body: RegisterOptionsRequest):
    options = generate_registration_options(
        rp_id=RP_ID,
        rp_name=RP_NAME,
        user_id=body.user_id.encode(),
        user_name=body.email,
        authenticator_selection=AuthenticatorSelectionCriteria(
            user_verification=UserVerificationRequirement.PREFERRED
        )
    )
    return options_to_json_dict(options)

@app.post("/auth/register/verify")
def register_verify(body:dict):
    verify_registration_response(
        credential=body['credential'],
        expected_challenge=body['chanllenge'],
        expected_origin=ORIGIN,
        expected_rp_id=RP_ID,
    )
    return{
        "status":"registration successful",
    }
    
@app.post("/auth/login/options")
def login_options(body: LoginOptionsRequest):
    options = generate_authentication_options(
        rp_id=RP_ID,
        allow_credentials=[]
    )
    return options_to_json_dict(options)

@app.post("/auth/login/verify")
def login_verify(body: dict):
    verify_authentication_response(
        credential=body['credential'],
        expected_challenge=body['challenge'],
        expected_origin=ORIGIN,
        expected_rp_id=RP_ID,
        credential_public_key=body['public_key'],
        credential_current_sign_count=body['sign_count']
    )
    return {
        "status":"authenticated"
    }