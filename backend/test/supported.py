import google.generativeai as genai
import pprint
genai.configure(api_key="AIzaSyBOGUyb82tAQI9h65rEE36euyvRZoYSVb8")
for model in genai.list_models():
    pprint.pprint(model)