import os
from openai import OpenAI
from dotenv import load_dotenv

class ChatGPTClient:
    def __init__(self, api_key=None):
        load_dotenv()
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("API key is required")
        self.client = OpenAI(api_key=self.api_key)

    def chat_with_gpt(self, system_message, user_message, model="gpt-3.5-turbo"):
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ]
            )
            return response
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return None

if __name__ == "__main__":
    chat_gpt_client = ChatGPTClient()
    
    system_msg = "Nutrition and work out plan expert"
    user_msg = ""

    response = chat_gpt_client.chat_with_gpt(system_msg, user_msg)
    
    if response:
        print("Response from ChatGPT API:")
        print(response.model_dump_json(indent=2))
    else:
        print("Failed to get a response from the ChatGPT API.")
