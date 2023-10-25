from datetime import datetime, timezone
from typing import Union

from dateutil import parser as dp


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
        case _ if value in ("None", "NONE"):
            return None

        # Intentar convertir a int
        case _ if value.isdigit() and value[0] != "0":
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


def iso8601_to_epoch(iso_time: str) -> int:
    """
    --- Documentación por ChatGPT ---
    Convierte una cadena de tiempo en formato ISO 8601 a una marca de tiempo
    (timestamp) en formato epoch.

    Parámetros
    ----------
    iso_time : str
        La cadena de tiempo en formato ISO 8601 que se desea convertir.

    Retorna
    -------
    int
        El valor de la marca de tiempo en formato epoch correspondiente a la
        fecha y hora especificada.

    Notas
    -----
    El formato ISO 8601 es un estándar internacional para la representación de
    fechas y horas. Un ejemplo de este
    formato es "2023-10-22T10:15:30Z". La función convierte este formato a un
    valor entero que representa el número
    total de segundos desde el 1 de enero de 1970 (conocido como "tiempo epoch"
    en Unix).

    Referencias
    -----------
    Esta implementación se basa en la solución propuesta en StackOverflow:
    https://stackoverflow.com/questions/27245488/converting-iso-8601-date-time-to-seconds-in-python

    Ejemplo
    -------
    >>> iso_time_string = "2023-07-18T20:35:30-04:00"
    >>> epoch_time = iso8601_to_epoch(iso_time_string)
    >>> print(epoch_time)
    1689726930
    """
    # https://stackoverflow.com/questions/27245488/converting-iso-8601-date-time-to-seconds-in-python
    parsed_time = dp.parse(iso_time)
    epoch = parsed_time.timestamp()
    return int(epoch)


def epoch_to_iso8601(epoch_time: int) -> str:
    """
    --- Documentación por ChatGPT ---
    Convierte una marca de tiempo (timestamp) en formato epoch a una cadena
    de tiempo en formato ISO 8601.

    Parámetros
    ----------
    epoch_time : int
        El valor de la marca de tiempo en formato epoch que se desea convertir.

    Retorna
    -------
    str
        La cadena de tiempo correspondiente en formato ISO 8601.

    Notas
    -----
    El formato ISO 8601 es un estándar internacional para la representación de
    fechas y horas. Un ejemplo de este formato es "2023-10-22T10:15:30Z". La
    función convierte un valor entero que representa el número total de
    segundos
    desde el 1 de enero de 1970 (conocido como "tiempo epoch" en Unix) a este
    formato.

    Ejemplo
    -------
    >>> epoch_time_value = 1689726930
    >>> iso_time = epoch_to_iso8601(epoch_time_value)
    >>> print(iso_time)
    "2023-07-18T20:35:30Z"
    """

    dt_object = datetime.fromtimestamp(epoch_time, tz=timezone.utc)
    return dt_object.isoformat().replace('+00:00', 'Z')

