from flask import Flask, request
import you

app = Flask(__name__)

@app.route('/ask')
def index():
    prompt = request.args.get('message')
    if not prompt:
        return 'Please provide a message parameter in the URL.'

    response = you.Completion.create(
        prompt=prompt,
        detailed=False,
        includelinks=False,
    )
    print(response['response'])
    return str(response['response'])

if __name__ == '__main__':
    app.run()
