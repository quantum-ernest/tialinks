import base64
import random
import re
import requests
from user_agents import parse
from urllib.parse import urlparse, parse_qs
from loguru import logger


def camel_to_snake(name):
    return re.sub(r"(?<!^)(?=[A-Z])", "_", name).lower()


def generate_otp() -> str:
    return str(random.randint(100000, 999999))


def generate_readable_short_code(length=6):
    custom_charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
    return "".join(random.choices(custom_charset, k=length))


def extract_user_agent(value: str) -> dict:
    user_agent = parse(value)
    data = {
        "user_agent": value,
        "operating_system": user_agent.os.family if user_agent.os.family else None,
        "browser": user_agent.browser.family if user_agent.browser.family else None,
        "device": user_agent.device.family if user_agent.device.family else None,
    }
    return {k: v for k, v in data.items() if v}


def extract_referer(value: str) -> dict:
    referer = urlparse(value)
    data = {
        "full_url": value,
        "domain": referer.netloc if referer.netloc else None,
        "path": referer.path if referer.path else None,
    }
    return {k: v for k, v in data.items() if v}


def extract_location(value: str) -> dict:
    try:
        url = f"http://ip-api.com/json/{value}?fields=status,message,continent,country,regionName,city"
        response = requests.get(url)
        if response.json().get("status") == "success":
            data = response.json()
            data = {
                "continent": data.get("continent"),
                "country": data.get("country"),
                "region": data.get("regionName"),
                "city": data.get("city"),
            }
            return data
    except Exception as e:
        logger.error(f"Error extracting location: {e}")


def get_favicon(url: str):
    google_url = f"https://www.google.com/s2/favicons?domain={url}&sz=128"
    response = requests.get(google_url)
    if response.status_code == 200:
        return base64.b64encode(response.content).decode("utf-8")
    return None


def extract_utm_data(url: str) -> dict:
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    utm_data = {
        "utm_source": query_params.get("utm_source", [None])[0],
        "utm_medium": query_params.get("utm_medium", [None])[0],
        "utm_campaign": query_params.get("utm_campaign", [None])[0],
    }
    return {k: v for k, v in utm_data.items() if v is not None}
