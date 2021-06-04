from django.shortcuts import render

# Create your views here


import hashlib
def hash_fuction(x):
	x = str(x)
	y = hashlib.sha256(x.encode())
	return y.hexdigest()


def index(request):
	if request.method == 'GET':
		data = request.GET.get('i', None)
		result = hash_fuction(data)
		return render(request, 'app/index.html', {"x":result})