import pytest

from utils import convert_str_to_typed, iso8601_to_epoch, epoch_to_iso8601


@pytest.mark.parametrize("input_str, expected_output", [
    ("123", 123),
    ("12.5", 12.5),
    ("125.", 125.0),
    (".125", 0.125),
    ("true", True),
    ("True", True),
    ("TRUE", True),
    ("false", False),
    ("None", None),
    ("Some Text", "Some Text"),
    ("Some.Text", "Some.Text"),
    ("0123", "0123"),
    ("1.2.3", "1.2.3"),
])
def test_convert_str_to_typed(input_str, expected_output):
    result = convert_str_to_typed(input_str)
    assert type(result) == type(expected_output)
    assert result == expected_output


def test_iso8601_to_epoch():
    iso_time = "2020-10-22T22:26:49Z"
    epoch_time = 1603405609

    result = iso8601_to_epoch(iso_time)
    assert type(result) is int
    assert result == epoch_time


def test_epoch_to_iso8601():
    iso_time = "2020-10-22T22:26:49Z"
    epoch_time = 1603405609

    result = epoch_to_iso8601(epoch_time)
    assert type(result) is str
    assert result == iso_time
