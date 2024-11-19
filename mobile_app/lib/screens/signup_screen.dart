import 'package:flutter/material.dart';
import 'package:mobile_app/Services/api_service.dart';

class SignupScreen extends StatefulWidget {
  @override
  _SignupScreenState createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();
  bool _isLoading = false;

  // Sign-up Function
  Future<void> _signup() async {
    // Basic Validation
    if (_nameController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please fill in all the fields.")),
      );
      return;
    }

    if (_passwordController.text != _confirmPasswordController.text) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Passwords do not match.")),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      // Call the API Service to register the user
      final result = await ApiService.registerUser(
        _nameController.text,
        _emailController.text,
        _passwordController.text,
      );

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'] ?? 'Account created! Please check your email for the verification code.')),
      );

      // Navigate to the login screen after successful registration
      Navigator.pop(context);
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sign-up failed: ${error.toString()}')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  // Build UI
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
                  _buildSignupForm(context),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  // Header Widget
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

  // Signup Form Widget
  Widget _buildSignupForm(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Create an Account',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        SizedBox(height: 20),
        _buildTextField('Full Name', Icons.person, controller: _nameController),
        SizedBox(height: 20),
        _buildTextField('Email Address', Icons.email, controller: _emailController),
        SizedBox(height: 20),
        _buildTextField('Password', Icons.lock, controller: _passwordController, obscureText: true),
        SizedBox(height: 20),
        _buildTextField('Confirm Password', Icons.lock, controller: _confirmPasswordController, obscureText: true),
        SizedBox(height: 20),
        Center(
          child: _isLoading
              ? CircularProgressIndicator()
              : ElevatedButton(
            onPressed: _signup,
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
              'Sign Up',
              style: TextStyle(fontSize: 18, color: Colors.white),
            ),
          ),
        ),
        SizedBox(height: 10),
        Center(
          child: TextButton(
            onPressed: () {
              Navigator.pop(context); // Navigate back to the login screen
            },
            child: Text(
              'Already have an account? Login',
              style: TextStyle(color: Colors.yellowAccent),
            ),
          ),
        ),
      ],
    );
  }

  // Text Field Builder
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
