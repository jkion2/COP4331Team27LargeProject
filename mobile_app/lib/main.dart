import 'package:flutter/material.dart';
import 'screens/login_screen.dart'; // Import the LoginScreen
import 'screens/verify_screen.dart';

void main() {
  runApp(EventifyApp());
}

class EventifyApp extends StatelessWidget {
  const EventifyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Eventify',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: LoginScreen(), // Removed 'const' from LoginScreen()
    );
  }
}
