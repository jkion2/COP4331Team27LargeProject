import 'package:flutter/material.dart';
import '../Services/api_service.dart';
import 'reset_password_screen.dart'; // Import LoginScreen
import 'login_screen.dart';
class VerifyScreen extends StatefulWidget {
  final String email;
  final bool isPasswordReset;

  VerifyScreen({required this.email, this.isPasswordReset = false});

  @override
  _VerifyScreenState createState() => _VerifyScreenState(); // Add this line
}

 createState() => _VerifyScreenState();


class _VerifyScreenState extends State<VerifyScreen> {
  final _codeController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();

  void _submitVerification() async {
    if (_formKey.currentState!.validate()) {
      String code = _codeController.text.trim();

      try {
        // Call the verify-email API with the appropriate type
        await _apiService.verifyResetCode(
          widget.email,
          code,
        );

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Code verified successfully!')),
        );

        if (widget.isPasswordReset) {
          // Navigate to ResetPasswordScreen for password reset
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => ResetPasswordScreen(
                email: widget.email,
                verificationCode: code, // Pass the verified code
              ),
            ),
          );
        } else {
          // For regular email verification, go to LoginScreen
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => LoginScreen()),
                (route) => false,
          );
        }
      } catch (error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${error.toString()}')),
        );
      }
    }
  }


  void _resendCode() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text("Verification code resent to ${widget.email}."),
        backgroundColor: Colors.blue,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text("Verify Email"),
        backgroundColor: Colors.red[700],
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(horizontal: 24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  "EVENTIFY",
                  style: TextStyle(
                    fontFamily: 'Roboto',
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.red[700],
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  "Verify Your Email",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
                SizedBox(height: 16),
                Text(
                  "Enter the verification code sent to your email.",
                  style: TextStyle(fontSize: 16, color: Colors.black),
                ),
                SizedBox(height: 24),
                TextFormField(
                  controller: _codeController,
                  decoration: InputDecoration(
                    labelText: "Verification Code",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    filled: true,
                    fillColor: Colors.grey[200],
                    contentPadding: EdgeInsets.symmetric(
                      vertical: 16,
                      horizontal: 16,
                    ),
                  ),
                  keyboardType: TextInputType.number,
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return "Please enter the verification code";
                    } else if (value.length != 6) {
                      return "Code must be 6 digits";
                    }
                    return null;
                  },
                ),
                SizedBox(height: 24),
                ElevatedButton(
                  onPressed: _submitVerification,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red[700],
                    padding: EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                    minimumSize: Size(double.infinity, 48),
                  ),
                  child: Text(
                    "Verify",
                    style: TextStyle(fontSize: 16, color: Colors.white),
                  ),
                ),
                SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Didn’t receive the code?",
                      style: TextStyle(color: Colors.black),
                    ),
                    TextButton(
                      onPressed: _resendCode,
                      child: Text(
                        "Resend",
                        style: TextStyle(color: Colors.red[700]),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
