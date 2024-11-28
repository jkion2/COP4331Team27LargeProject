import 'package:flutter/material.dart';
import 'package:mobile_app/Services/api_service.dart'; // Import ApiService
import 'verify_screen.dart'; // Import VerifyScreen if it’s used for verified users
import 'signup_screen.dart'; // Import SignupScreen for navigation to signup

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _loginController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  Future<void> _login() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final result = await ApiService.loginUser(
        _loginController.text,
        _passwordController.text,
      );

      if (result['id'] != -1) {
        // Navigate to VerifyScreen if login is successful
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => VerifyScreen()),
        );
      } else {
        // Show an error message if login failed
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result['error'])),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login failed: $error')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.deepPurpleAccent, Colors.pinkAccent],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Center(
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(height: 100),
                  _buildHeader(),
                  SizedBox(height: 60),
                  _buildLoginForm(context),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Center(
      child: Text(
        'EVENTIFY',
        style: TextStyle(
          fontSize: 42,
          fontWeight: FontWeight.bold,
          color: Colors.white,
          letterSpacing: 2.0,
          shadows: [
            Shadow(
              color: Colors.black26,
              offset: Offset(2, 2),
              blurRadius: 10,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoginForm(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Login to Party!',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 10),
        Row(
          children: [
            Text(
              "Don’t have an account?",
              style: TextStyle(color: Colors.white70),
            ),
            TextButton(
              onPressed: () {
                // Navigate to the signup screen
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => SignupScreen()),
                );
              },
              child: Text(
                'Sign Up',
                style: TextStyle(color: Colors.yellowAccent),
              ),
            ),
          ],
        ),
        SizedBox(height: 20),
        _buildTextField('Username', Icons.person, controller: _loginController),
        SizedBox(height: 20),
        _buildTextField('Password', Icons.lock, controller: _passwordController, obscureText: true),
        SizedBox(height: 10),
        Align(
          alignment: Alignment.centerRight,
          child: TextButton(
            onPressed: () {
              // Forgot password functionality
            },
            child: Text(
              'Forgot password?',
              style: TextStyle(color: Colors.yellowAccent),
            ),
          ),
        ),
        SizedBox(height: 20),
        Center(
          child: _isLoading
              ? CircularProgressIndicator()
              : ElevatedButton(
            onPressed: _login,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.deepOrangeAccent,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10.0),
              ),
              padding: EdgeInsets.symmetric(vertical: 15, horizontal: 50),
              elevation: 10,
              shadowColor: Colors.deepOrangeAccent.withOpacity(0.5),
            ),
            child: Text(
              'Login',
              style: TextStyle(fontSize: 18, color: Colors.white),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTextField(String label, IconData icon, {required TextEditingController controller, bool obscureText = false}) {
    return TextFormField(
      controller: controller,
      obscureText: obscureText,
      style: TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: TextStyle(color: Colors.white70),
        prefixIcon: Icon(icon, color: Colors.white70),
        filled: true,
        fillColor: Colors.white.withOpacity(0.1),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }
}
