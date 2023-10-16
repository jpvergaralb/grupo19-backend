from typing import Union


def convert_str_to_typed(value: str) -> Union[str, int, float, bool, None]:
    match True:
        case _ if None:
            return None

        # Intentar convertir a int
        case _ if value.isdigit():
            return int(value)

        # Intentar convertir a float
        case _ if "." in value:
            try:
                return float(value)
            except ValueError:
                return value

        case _ if value.lower() in ("true", "false"):
            # Intentar convertir a bool
            return True if value.lower() == "true" else False

        case _:
            return value

