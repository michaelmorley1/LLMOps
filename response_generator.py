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

    def chat_with_gpt(self, system_message, user_message, model="gpt-4o"):
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": user_message}
                ]
            )
            # Access the message content correctly
            return response.choices[0].message.content
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return None

class ResponseGenerator:
    def __init__(self):
        self.chat_gpt_client = ChatGPTClient()
        self.system_msg = """You are a Nutrition and workout plan expert
        Make a weekly day by day plan
        make it personalised and always greet the user by their name,
        always mention their age, height and weight base the plan around such information.
        make it very personlised make sure the user can see you know who they are and give very specialised advise
        Never include this in the message Best, [Your Name]
        """

    def generate_response(self, user_message):
        return self.chat_gpt_client.chat_with_gpt(self.system_msg, user_message)
