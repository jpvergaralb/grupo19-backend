from typing import Union


def convert_str_to_typed(value: str) -> Union[str, int, float, bool, None]:
    """
    --- Documentación por ChatGPT ---

    Convierte una cadena de texto en su tipo de dato correspondiente si es
    posible.

    La función intenta convertir la cadena de texto proporcionada a uno de
    los siguientes tipos:
    - int
    - float
    - bool
    - None
    Si no puede convertirse a ninguno de esos tipos, se devuelve la cadena
    de texto original.

    Parámetros
    ----------
    value : str
        La cadena de texto que se intentará convertir.

    Retorna
    -------
    Union[str, int, float, bool, None]
        El valor convertido. Si no se puede determinar un tipo específico,
        se devuelve
        la cadena de texto original.

    Ejemplos
    --------
    >>> convert_str_to_typed("123")
    123

    >>> convert_str_to_typed("12.5")
    12.5

    >>> convert_str_to_typed("true")
    True

    >>> convert_str_to_typed("ChatGPT")
    'ChatGPT'
    """
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

