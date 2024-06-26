import requests
import time

def make_alert(service_name, message_data):
    slack_url = "https://hooks.slack.com/services/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"

    if not service_name:
        service_name = "An 'unknown' service"

    payload = {
        "text": f"NOTIFICATION SERVICE\n{message_data}"
    }
    response = requests.post(slack_url, json=payload)
    return response.status_code == 200

def do_poll(poll_url):
    valid_status_codes = {100, 101, 102, 103, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 226, 300, 301, 302, 303, 304, 305, 307, 308, 401, 402, 403, 405}
    try:
        response = requests.get(poll_url)

    except exception as e:
        return "down"

    return "up" if response.status_code in valid_status_codes else "down"

urls = [
    "https://grupo19-front.fjcf2001.me/",
    "https://api.arqui-workers.ljg.cl/heartbeat",
    "https://api.arqui.ljg.cl/stocks",
    "https://mqtt.arqui.ljg.cl/",
    "https://dashboard.arqui.ljg.cl/"
]

pattern_down = ["up"] * 6 + ["down"] * 4

pattern_up = ["down"] * 6 + ["up"] * 4
pattern_starting = ["starting"] * 10

states = {url: ["starting"] * 10 for url in urls}

continue_flag = False

while True:
    if continue_flag:
        continue_flag = False
        continue

    for url in urls:
        if states[url] == pattern_starting:
            make_alert(url, f"Algo se reinició posiblemente de forma manual, ¿un deploy tal vez?\n...o crasheó el contenedor de alertas y se reinició solito.\n🤷")
            print(f"'{url}' REINICIO", flush=True)
            states = {url: ["up"] * 5 + ["down"] * 5 for url in urls}
            continue_flag = True

        if continue_flag:
            continue_flag = False
            break

        states[url].pop(0)
        states[url].append(do_poll(url))

        print(f"Estado actual para {url}: {states[url]}", flush=True)
        #print(f"Esperando para 'en línea': {pattern_up}", flush=True)

        if states[url] == pattern_up:
            print(f"'{url}' se encuentra en línea nuevamente", flush=True)
            make_alert(url, f"'{url}' se encuentra en línea nuevamente")

        elif states[url] == pattern_down:
            make_alert(url, f"'{url}' NO RESPONDE")
            print(f"'{url}' NO RESPONDE", flush=True)

        time.sleep(1)

    time.sleep(30)
