import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(height: 50), // Spacing at the top
              _buildHeader(),
              SizedBox(height: 40),
              _buildLoginForm(context),
              SizedBox(height: 20),
              _buildSocialLoginOptions(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Text(
      'EVENTIFY',
      style: TextStyle(
        fontSize: 36,
        fontWeight: FontWeight.bold,
        color: Colors.redAccent, 
      ),
    );
  }

  Widget _buildLoginForm(BuildContext context) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        'Login',
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
        ),
      ),
      SizedBox(height: 10),
      Row(
        children: [
          Text("Don’t have an account?"),
          TextButton(
            onPressed: () {
              // Navigate to sign up page
            },
            child: Text('Sign Up', style: TextStyle(color: Colors.redAccent)),
          ),
        ],
      ),
      SizedBox(height: 20),
      TextFormField(
        decoration: InputDecoration(
          labelText: 'Email address',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
        ),
      ),
      SizedBox(height: 20),
      TextFormField(
        obscureText: true,
        decoration: InputDecoration(
          labelText: 'Password',
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(10.0),
          ),
        ),
      ),
      SizedBox(height: 10),
      Align(
        alignment: Alignment.centerRight,
        child: TextButton(
          onPressed: () {
            // Forgot password functionality
          },
          child: Text('Forgot password?', style: TextStyle(color: Colors.redAccent)),
        ),
      ),
      SizedBox(height: 20),
      Padding(
        padding: const EdgeInsets.only(left: 100.0), // Adjust the padding value as needed
        child: SizedBox(
          width: 850,
          child: ElevatedButton(
          onPressed: () {
            // Login functionality
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.redAccent, // Updated to `backgroundColor`
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(10.0),
            ),
          ),
          child: Text('Login', style: TextStyle(fontSize: 18)),
        ),
      ),
      ),
    ],
  );
}

  Widget _buildSocialLoginOptions() {
    // Placeholder for social login options
    return Container();
  }
}
