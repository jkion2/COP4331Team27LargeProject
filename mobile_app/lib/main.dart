import 'package:flutter/material.dart';
import 'screens/login_screen.dart';  // Import the login screen file

void main() {
  runApp(EventifyApp());
}

class EventifyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Eventify',
      theme: ThemeData(
        primarySwatch: Colors.red,
      ),
      home: LoginScreen(),  // Set LoginScreen as the home screen
    );
  }
}
