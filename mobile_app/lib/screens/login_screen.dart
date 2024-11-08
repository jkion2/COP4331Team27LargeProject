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
              SizedBox(height: 80), // Spacing at the top
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
        color: Colors.redAccent, // Change color as per your design
      ),
    );
  }

  Widget _buildLoginForm(BuildContext context) {
    // Placeholder for the form
    return Container();
  }

  Widget _buildSocialLoginOptions() {
    // Placeholder for social login options
    return Container();
  }
}
