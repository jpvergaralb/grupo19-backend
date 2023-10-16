import numpy as np


def linear_regression(x: np.ndarray, y: np.ndarray) -> tuple[float, float]:
    """
    --- Documentación por ChatGPT ---
    Realiza una regresión lineal simple sobre los datos proporcionados.

    Params
    ----------
    x : numpy.ndarray
        Variable independiente, que en este contexto representa típicamente
        el tiempo.
    y : numpy.ndarray
        Variable dependiente, que representa los precios de las acciones en
        este contexto.

    Returns
    -------
    float
        La pendiente (m) de la línea de regresión.
    float
        La ordenada al origen (b) de la línea de regresión.

    Notas
    -----
    La línea de regresión se calcula utilizando la fórmula:
        y = mx + b
    Donde:
        m = (Σ(xi - x̄)(yi - ȳ)) / Σ(xi - x̄)^2
        b = ȳ - m * x̄
    Aquí, x̄ es la media de los valores x y ȳ es la media de los valores y.

    Ejemplo
    -------
    >>> x = np.array([1, 2, 3, 4, 5])
    >>> y = np.array([2, 4, 5, 4, 5])
    >>> m, b = linear_regression(x, y)
    >>> print(f"y = {m:.2f}x + {b:.2f}")
    y = 0.60x + 2.20
    """
    x_mean: np.float64 = np.mean(x)
    y_mean: np.float64 = np.mean(y)

    numerator: float = sum((x - float(x_mean)) * (y - float(y_mean)))
    denominator: float = sum((x - float(x_mean)) ** 2)

    slope: float = numerator / denominator
    base: float = y_mean - m * x_mean

    return slope, base


def


