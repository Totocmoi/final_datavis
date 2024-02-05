import csv
import json
import os
import re
import urllib.request

import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse


def highest_link(list_link):
    best_link = None
    best_n = 0
    for link in list_link:
        n = re.search(r'\d+', link).group()
        n=int(n)
        if n > 100:
            n = 6
        if n > best_n:
            best_link = link
    return best_link


def fetch(url="https://www.smogon.com/stats/"):
    dirs = []
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        links = soup.find_all('a', href=True)
        for link in links:
            href = link.get('href')
            # Ugly, but allow to return useful links and create directories if the url is the default one
            if href != "../":
                if url == "https://www.smogon.com/stats/":
                    if not os.path.exists(href[:-1]+".csv"):
                        #os.makedirs(href[:-1])
                        dirs.append(urljoin(url, href) + "chaos/")
                else:
                    dirs.append(urljoin(url, href))
    else:
        print("Error ", response.status_code)
    return dirs


def link_to_csv(link, csv_file):
    lines = [["name", "usage", "moves", "abilities", "items", "teammates"]]
    data = json.load(urllib.request.urlopen(link))["data"]
    for name in data:
        pokemon_d = data[name]
        moves = pokemon_d["Moves"]
        abilities = pokemon_d["Abilities"]
        items = pokemon_d["Items"]
        teammates = pokemon_d["Teammates"]
        lines.append([name, pokemon_d["Raw count"], moves, abilities, items, teammates])

    with open(csv_file, mode='w', newline='') as file_csv:
        writer = csv.writer(file_csv, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        writer.writerows(lines)



if __name__ == "__main__":
    os.chdir("../datasets/raw_data")
    dirs = fetch()
    tiers = ["ou-1825"]
    for url in dirs:
        files = fetch(url)
        parsed_url = urlparse(url)
        for tier in tiers:
            relevant_links = [f for f in files if f.endswith(tier + ".json")]
            link = highest_link(relevant_links)
            print(link)
            csv_file = parsed_url.path.split("/")[-3] + ".csv"
            link_to_csv(link, csv_file)
