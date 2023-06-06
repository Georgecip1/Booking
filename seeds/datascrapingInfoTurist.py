import requests
from bs4 import BeautifulSoup
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import re


req = requests.get(
    'https://www.turistinfo.ro/bacau/cazare-hoteluri-vile-pensiuni-bacau.html')
soup = BeautifulSoup(req.text, "html.parser")
cazare = []
for nume in soup.find_all('span', {'itemprop': 'name'}):
    cazare.append(nume.text.strip())

cazare = list(filter(lambda k: 'Cazare' not in k, cazare))


authors = ["admin", "admin", "admin"];
recenzii = []
for rating in soup.find_all('div', {'class': 'ucrecenzii valign-wrapper'}):
    recenzii.append(rating.text.strip())
recenzii = [elem.replace("question_answer \xa0 ", '') for elem in recenzii]

prices = []
for p in soup.find_all('div', {'itemprop': 'priceRange'}):
    price_text = p.text
    price_numbers = re.findall(r'\d+', price_text)
    price = int(''.join(price_numbers))
    prices.append(price)
    
locatie = []
for loc in soup.find_all('span', {'itemprop': 'address'}):
    locatie.append(loc.text)
    
# Set up the Chrome browser with Selenium
options = Options()
options.headless = True  # Run the browser in headless mode (no GUI)
driver = webdriver.Chrome(options=options)

# Load the website
url = 'https://www.turistinfo.ro/bacau/cazare-hoteluri-vile-pensiuni-bacau.html'
driver.get(url)

# Wait for the images to load
WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.XPATH, '//img[@itemprop="image"]')))

# Get the image URLs
imagini = []
for img in driver.find_elements(By.CSS_SELECTOR, 'img[itemprop="image"]'):
    img_url = img.get_attribute('src')
    if not img_url.startswith('https://www.turistinfo.ro'):
        img_url = 'https://www.turistinfo.ro' + img_url
    imagini.append(img_url)

# Close the browser
driver.quit()
# d = {'Nume Hotel': cazare, 'Recenzii': recenzii, 'Pret': pret}

f = open("output_cazari.txt", "w", encoding="utf-8")
for (a, b, c, d, e) in zip(cazare, recenzii, prices, locatie, imagini):
    print(a, b, c, d, e)
    f.write("Name: " + str(a) + "\n")
    f.write("Reviews: " + str(b) + "\n")
    f.write("Price: " + str(c) + "\n")
    f.write('Location: ' + str(d) + '\n')
    f.write('Image: ' + str(e) + '\n')
    f.write("\n")
    
cazari = []
for (a, b, c, d, e, author) in zip(cazare, recenzii, prices, locatie, imagini, authors):
    cazare_dict = {
        'author': author,
        'name': a,
        'reviews': b,
        'price': c,
        'location': d,
        'image': e
    }
    cazari.append(cazare_dict)

# Write the data to a JSON file
with open('output_cazari.json', 'w') as f:
    json.dump(cazari, f)