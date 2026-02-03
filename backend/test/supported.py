import google.generativeai as genai
import pprint
genai.configure(api_key="") # Add API KEY here
for model in genai.list_models():
    pprint.pprint(model)