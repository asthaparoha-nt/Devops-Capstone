from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse


def success_response(message: str, data=None, status_code: int = 200):

    print("\n========== SUCCESS RESPONSE ==========")
    print(data)

    if isinstance(data, dict):
        for key, value in data.items():
            print(key, type(value), value)

    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder(
            {
                "success": True,
                "message": message,
                "data": data
            }
        )
    )


def error_response(message: str, status_code: int):
    return JSONResponse(
        status_code=status_code,
        content=jsonable_encoder(
            {
                "success": False,
                "message": message
            }
        )
    )