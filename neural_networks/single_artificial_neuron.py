
# code from Hamed Shah Hosseini

# artificial neuron

import numpy as np

# so I can get the same numbers each time, set a global seed
np.random.seed(42)   # set seed globally

# define the neuro with y = φ(sum(wi*xi, for i = 1 ... num_input) + b) 
#  φ is the activation function and we can choose it to be anything, but typically
# relu, logostiic regression, or even linear
# define the neuron with y =  φ(x^Tw + b)

class ArtificialNeuron:
  # so we initially pass in the number of input "neurons"
  # and optionally add the activation function. But if we don't specific activation
  # function, then it will be logistic
  def __init__(self, n_inputs, activation = 'logistic'):
    # mean of 0 and std of 1
    # np.random.randn(n_inputs) will make an array of size n_inputs and the values will be random
    # based on mean of 0 and std of 1. If we pass in 3 for example, it will mlake an array with 3 values
    # and each value random based on mean of 0 and std of 1
    self.weights = np.random.randn(n_inputs)
    # generate a random number based on 0 mean and 1 std 
    self.bias = np.random.randn()
    # set up the activation function
    self.activation = activation
    
  def __call__(self, x):
    # sum up all the weight * x's combinations and then add the bias
    # like wi*xi for i = 1 to n and then add the bias term b
    z = np.dot(x, self.weights) + self.bias
    if self.activation == 'logistic':
      # below is the logistic function. But I don't know why we pass in z.
      # maybe because z is the final number?
      return 1  / (1 + np.exp(-z))
    # if I remember correctly, relu is a way to make sure it doesn't go negative
    # this comes from how relu is defined
    elif self.activation == 'relu':
      return np.maximum(0,z)
    else: # linear
      # so no additional activation function?
      return z
    
    

# activation_function = 'relu'
# activation_function = 'logistic'
activation_function = 'linear'
neuron = ArtificialNeuron(n_inputs=3, activation = activation_function)

x = np.array([0.3, -1.2, 0.7])
y = neuron(x)

# print(y)

print(f'Input x is: {x}')
print(f'Output y is: {y}')
print(f'Weights are: {neuron.weights}')
print(f'Activation function is {neuron.activation}')
print(f'Bias is {neuron.bias}')

# So to sum up, we take the dot product of x array and weights array
# then we apply an activation function to that final answer before to gert another
# answer


# HOW TO TEST THIS ON SOMETHING MORE USEFUL??

# bias is 1.5230298564080254 if logistic

# relu and linear give same answer
