import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String _baseUrl = 'http://10.0.2.2:5000/api'; // For Android emulator, use http://localhost:5000 for iOS Simulator/real devices

  // Login User
  static Future<Map<String, dynamic>> loginUser(String login, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'login': login, 'password': password}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Return user data
    } else if (response.statusCode == 401 || response.statusCode == 403) {
      throw Exception(jsonDecode(response.body)['error']); // Return server error message
    } else {
      throw Exception('Login failed with status code ${response.statusCode}');
    }
  }

  // Register User
  static Future<Map<String, dynamic>> registerUser(String username, String email, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'email': email, 'password': password}),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body); // Return success response
    } else if (response.statusCode == 400) {
      throw Exception(jsonDecode(response.body)['error']); // Handle missing fields or validation errors
    } else {
      throw Exception('Registration failed with status code ${response.statusCode}');
    }
  }

  // Verify Email
  static Future<Map<String, dynamic>> verifyEmail(String userId, String verificationCode) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/verify-email'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'verificationCode': verificationCode}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Return success message
    } else if (response.statusCode == 400) {
      throw Exception(jsonDecode(response.body)['error']); // Handle invalid verification codes
    } else {
      throw Exception('Verification failed with status code ${response.statusCode}');
    }
  }

  // Add Contact
  static Future<Map<String, dynamic>> addContact(String userId, String name, String email) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/contacts/add'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'name': name, 'email': email}),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body); // Contact added successfully
    } else {
      throw Exception('Failed to add contact with status code ${response.statusCode}');
    }
  }

  // Delete Contact
  static Future<Map<String, dynamic>> deleteContact(String contactId) async {
    final response = await http.delete(
      Uri.parse('$_baseUrl/contacts/$contactId/delete'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Contact deleted successfully
    } else {
      throw Exception('Failed to delete contact with status code ${response.statusCode}');
    }
  }

  // Edit Contact
  static Future<Map<String, dynamic>> editContact(String contactId, String name, String email) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/contacts/$contactId/edit'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Contact updated successfully
    } else {
      throw Exception('Failed to edit contact with status code ${response.statusCode}');
    }
  }

  // Search Contacts
  static Future<List<dynamic>> searchContacts(String userId, String searchQuery) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/contacts/search'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'search': searchQuery}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Return search results
    } else {
      throw Exception('Failed to search contacts with status code ${response.statusCode}');
    }
  }

  // Create Event
  static Future<Map<String, dynamic>> createEvent(String title, String description, String date, String organizerId) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/events/create'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'title': title,
        'description': description,
        'date': date,
        'organizerId': organizerId,
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body); // Event created successfully
    } else {
      throw Exception('Failed to create event with status code ${response.statusCode}');
    }
  }

  // Edit Event
  static Future<Map<String, dynamic>> editEvent(String eventId, String title, String description, String date) async {
    final response = await http.put(
      Uri.parse('$_baseUrl/events/$eventId/edit'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'title': title,
        'description': description,
        'date': date,
      }),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Event updated successfully
    } else {
      throw Exception('Failed to edit event with status code ${response.statusCode}');
    }
  }

  // Delete Event
  static Future<Map<String, dynamic>> deleteEvent(String eventId) async {
    final response = await http.delete(
      Uri.parse('$_baseUrl/events/$eventId/delete'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Event deleted successfully
    } else {
      throw Exception('Failed to delete event with status code ${response.statusCode}');
    }
  }

  // Invite User to Event
  static Future<Map<String, dynamic>> inviteToEvent(String eventId, String invitedUserId) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/events/$eventId/invite'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'invitedUserId': invitedUserId}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Invitation sent successfully
    } else {
      throw Exception('Failed to send invitation with status code ${response.statusCode}');
    }
  }

  // Notify Event Update
  static Future<Map<String, dynamic>> notifyEventUpdate(String eventId) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/events/$eventId/notify-update'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Update notifications sent successfully
    } else {
      throw Exception('Failed to notify update with status code ${response.statusCode}');
    }
  }

  // Send Event Reminders
  static Future<Map<String, dynamic>> sendEventReminder() async {
    final response = await http.post(
      Uri.parse('$_baseUrl/events/reminder'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body); // Reminders sent successfully
    } else {
      throw Exception('Failed to send event reminders with status code ${response.statusCode}');
    }
  }
}
