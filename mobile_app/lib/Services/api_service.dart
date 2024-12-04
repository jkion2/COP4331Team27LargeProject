import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../screens/eventDashboard_screen.dart';


class ApiService {
  final String baseUrl = "http://event-ify.xyz:3000/api";

  // User Management

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);

      // Save userId and username in shared preferences
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', data['user']['id']);
      await prefs.setString('username', data['user']['username']);

      return data;
    } else {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Register
  Future<Map<String, dynamic>> register(String username, String email,
      String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(
          {'username': username, 'email': email, 'password': password}),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Verify Email
  Future<void> verifyEmail(String verificationCode) async {
    final response = await http.post(
      Uri.parse('$baseUrl/verify-email'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'verificationCode': verificationCode}),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Add this method to fetch userId or username
  Future<String?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('userId');
  }

  Future<String?> getUsername() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('username');
  }

  // Contact Management

  // Add Contact
  Future<Map<String, dynamic>> addContact(String userId, String name,
      String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/contacts/add'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'name': name, 'email': email}),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Delete Contact
  Future<void> deleteContact(String contactId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/contacts/$contactId/delete'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Edit Contact
  Future<void> editContact(String contactId, String name, String email) async {
    final response = await http.put(
      Uri.parse('$baseUrl/contacts/$contactId/edit'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'name': name, 'email': email}),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Search Contacts
  Future<List<Map<String, dynamic>>> searchContacts(String userId,
      String search) async {
    final response = await http.post(
      Uri.parse('$baseUrl/contacts/search'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'userId': userId, 'search': search}),
    );

    if (response.statusCode == 200) {
      return List<Map<String, dynamic>>.from(jsonDecode(response.body));
    } else {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Event Management

  // Fetch all or filtered events
  Future<List<Event>> getEvents() async {
    final userId = await getUserId();

    final response = await http.get(
      Uri.parse('$baseUrl/events?userId=$userId'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final List<dynamic> eventList = jsonDecode(response.body);

      // Map organizer data dynamically from the backend response
      return eventList.map((event) => Event.fromJson(event)).toList();
    } else {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }





  // Create Event
  Future<Map<String, dynamic>> createEvent(String title, String description,
      String date, String organizerId, String location) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/create'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'title': title,
        'description': description,
        'date': date,
        'organizerId': organizerId, // Correctly maps organizerId
        'location': location, // Correctly maps location
      }),
    );

    if (response.statusCode == 201) {
      return jsonDecode(response.body);
    } else {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }


  // Edit Event
  Future<void> editEvent(String eventId, String title, String description,
      String date, String location) async {
    final response = await http.put(
      Uri.parse('$baseUrl/events/$eventId/edit'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'title': title,
        'description': description,
        'date': date,
        'location': location,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Delete Event
  Future<void> deleteEvent(String eventId) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/events/$eventId/delete'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Invite to Event
  Future<void> inviteToEvent(String eventId, String invitedUserId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/$eventId/invite'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'invitedUserId': invitedUserId}),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

// Invite to Event by Email
  Future<void> inviteToEventByEmail(String eventId,
      String recipientEmail) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/$eventId/invite'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(
          {'recipientEmail': recipientEmail}), // Ensure correct key
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }


  // Notify Event Update
  Future<void> notifyEventUpdate(String eventId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/$eventId/notify-update'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

  // Send Event Reminder
  Future<void> sendEventReminder() async {
    final response = await http.post(
      Uri.parse('$baseUrl/events/reminder'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }
// Request password reset
  Future<void> requestPasswordReset(String email) async {
    final response = await http.post(
      Uri.parse('$baseUrl/request-password-reset'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email}),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

// Verify reset code
  Future<void> verifyResetCode(String email, String resetCode) async {
    final response = await http.post(
      Uri.parse('$baseUrl/verify-reset-code'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'resetCode': resetCode}),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }

// Reset password
  Future<void> resetPassword(String email, String resetCode, String newPassword) async {
    final response = await http.post(
      Uri.parse('$baseUrl/reset-password'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'resetCode': resetCode,
        'newPassword': newPassword,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception(jsonDecode(response.body)['error']);
    }
  }


  Future<Event> getEventById(String eventId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/events?eventId=$eventId'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final Map<String, dynamic> eventData = jsonDecode(response.body);
      return Event.fromJson(eventData); // Parse event data into the Event model.
    } else {
      throw Exception("Failed to fetch event details: ${response.body}");
    }
  }
  Future<Event> fetchEventDetails(String eventId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/events?eventId=$eventId'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final eventData = jsonDecode(response.body);
      return Event.fromJson(eventData);
    } else {
      throw Exception("Failed to fetch event details: ${response.body}");
    }
  }


}
