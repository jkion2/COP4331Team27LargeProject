import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'AddOrEditEvent_screen.dart';
import 'event_card.dart';
import '../Services/api_service.dart'; // Import ApiService
import 'package:shared_preferences/shared_preferences.dart';
import 'login_screen.dart'; // Import LoginScreen

class EventDashboard extends StatefulWidget {
  @override
  _EventDashboardState createState() => _EventDashboardState();
}

class _EventDashboardState extends State<EventDashboard> {
  final ApiService _apiService = ApiService(); // Initialize ApiService
  int _selectedTabIndex = 0;
  String? username; // To store the username
  String? userId; // To store the logged-in user's ID
  List<Event> _yourEvents = [];
  List<Event> _allEvents = [];
  List<Event> _pastEvents = [];

  // Tabs
  final List<String> _tabs = ["Upcoming Events", "Your Events", "Past Events"];

  // Fetch username and userId
  Future<void> _loadUserData() async {
    try {
      final fetchedUsername = await _apiService.getUsername();
      final fetchedUserId = await _apiService.getUserId();
      setState(() {
        username = fetchedUsername;
        userId = fetchedUserId;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to load user data: $e")),
      );
    }
  }

  Future<void> _sendInviteToBackend(Event event, String recipientEmail) async {
    try {
      await _apiService.inviteToEvent(event.id!, recipientEmail); // Call the API service to send the invite
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Event sent successfully!")),
      );
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to send event: $error")),
      );
    }
  }


  // Logout functionality
  Future<void> _logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear(); // Clear all stored user data
    if (mounted) {
      Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => LoginScreen()),
            (route) => false,
      );
    }
  }

  // Show profile menu
  void _showProfileMenu(BuildContext context, Offset offset) {
    showMenu(
      context: context,
      position: RelativeRect.fromLTRB(offset.dx, offset.dy, 0, 0),
      items: [
        PopupMenuItem(
          value: 'logout',
          child: Row(
            children: [
              Icon(Icons.logout, color: Colors.black),
              SizedBox(width: 8),
              Text("Logout"),
            ],
          ),
        ),
      ],
    ).then((value) {
      if (value == 'logout') {
        _logout();
      }
    });
  }

  // Categorize events into tabs
  void _categorizeEvents() {
    DateTime now = DateTime.now();

    // "Your Events" includes only events the user created
    _yourEvents = _allEvents.where((e) => e.organizerId == userId).toList();

    // "Past Events" includes events with a date in the past
    _pastEvents = _allEvents.where((e) => e.dateTime.isBefore(DateTime.now())).toList();
  }

  // Fetch events
  Future<void> _fetchEvents() async {
    try {
      final List<Event> events = await _apiService.getEvents(); // Fetch all events
      setState(() {
        _allEvents = events;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to fetch events: $e")),
      );
    }
  }





  // Add an event
  void _addEvent(Event newEvent) async {
    try {
      // Ensure the user ID is fetched properly
      final organizerId = await _apiService.getUserId();
      if (organizerId == null) throw Exception("User ID not found");

      // Create the event on the server
      await _apiService.createEvent(
        newEvent.title,
        newEvent.description,
        newEvent.dateTime.toIso8601String(),
        newEvent.location,
        organizerId,
      );

      // Refetch all events to reflect the newly added event
      await _fetchEvents();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Event created successfully!")),
      );
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to add event: $error")),
      );
    }
  }


  // Edit an event
  void _editEvent(int index, Event updatedEvent) async {
    try {
      await _apiService.editEvent(
        updatedEvent.id!,
        updatedEvent.title,
        updatedEvent.description,
        updatedEvent.dateTime.toIso8601String(),
        updatedEvent.location,
      );

      // Update local event data
      setState(() {
        _allEvents[index] = updatedEvent; // Update the event in the all events list
        _categorizeEvents(); // Reorganize events into their respective tabs
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Event updated successfully!")),
      );
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to update event: $error")),
      );
    }
  }


  // Delete an event
  void _deleteEvent(int index) async {
    try {
      // Determine which list is currently displayed
      List<Event> events;
      if (_selectedTabIndex == 0) {
        events = _allEvents; // "All Events"
      } else if (_selectedTabIndex == 1) {
        events = _yourEvents; // "Your Events"
      } else {
        events = _pastEvents; // "Past Events"
      }

      final eventId = events[index].id; // Get the ID of the event to delete

      // Remove the event from the backend
      await _apiService.deleteEvent(eventId!);

      // Remove the event from the local list
      setState(() {
        events.removeAt(index);
      });

      // Re-fetch all events to refresh the categorized lists
      await _fetchEvents();

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Event deleted successfully!")),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to delete event: $e")),
      );
    }
  }

  // Send an event
  void _sendEvent(Event event) async {
    try {
      await _apiService.inviteToEvent(event.id!, "user123"); // Replace "user123" with actual user ID to invite
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Event sent successfully!")),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to send event: $e")),
      );
    }
  }

  //Send invite
  void _sendInvite(Event event, String recipientEmail) async {
    try {
      await _sendInviteToBackend(event, recipientEmail);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Invitation sent successfully")),
      );
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to send invitation: $error")),
      );
    }
  }



  //getting user id:
  Future<String?> _selectUserDialog(BuildContext context) async {
    final TextEditingController controller = TextEditingController();

    return showDialog<String>(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Invite User"),
          content: TextField(
            controller: controller,
            decoration: InputDecoration(
              labelText: "User ID",
              hintText: "Enter the User ID to invite",
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context, null), // Cancel
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () => Navigator.pop(context, controller.text), // Submit
              child: Text("Send Invite"),
            ),
          ],
        );
      },
    );
  }


  // Show event details
  void _showEventDetails(BuildContext context, Event event) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        TextEditingController emailController = TextEditingController();

        return AlertDialog(
          title: Text("Invite to Event"),
          content: TextField(
            controller: emailController,
            decoration: InputDecoration(labelText: "Recipient's Email"),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text("Cancel"),
            ),
            TextButton(
              onPressed: () {
                final email = emailController.text.trim();
                if (email.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Please enter an email address.")),
                  );
                  return;
                }

                print("Sending invite to: $email"); // Debug log
                Navigator.pop(context); // Close the dialog
                _sendInvite(event, email); // Trigger the invite process
              },
              child: Text("Send"),
            ),
          ],
        );
      },
    );

  }

  // Tab bar widget
  Widget _buildTabBar() {
    return Container(
      color: Colors.red[100],
      padding: EdgeInsets.symmetric(horizontal: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: _tabs.map((tab) {
          int index = _tabs.indexOf(tab);
          return GestureDetector(
            onTap: () => setState(() => _selectedTabIndex = index),
            child: Column(
              children: [
                Text(
                  tab,
                  style: TextStyle(
                    color: _selectedTabIndex == index
                        ? Colors.red[700]
                        : Colors.grey,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 4),
                if (_selectedTabIndex == index)
                  Container(
                    width: 60,
                    height: 2,
                    color: Colors.red[700],
                  )
              ],
            ),
          );
        }).toList(),
      ),
    );
  }


// Build event list
  Widget _buildEventList() {
    List<Event> events;

    if (_selectedTabIndex == 0) {
      events = _allEvents; // "All Events" Tab
    } else if (_selectedTabIndex == 1) {
      events = _yourEvents; // "Your Events" Tab
    } else {
      events = _pastEvents; // "Past Events" Tab
    }

    if (events.isEmpty) {
      return Center(
        child: Text(
          "No events found.",
          style: TextStyle(color: Colors.grey),
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: events.length,
      itemBuilder: (context, index) {
        final event = events[index];

        return EventCard(
          event: event,
          userId: userId,
          onEdit: () => _openEditEventPage(context, index, event),
          onDelete: () => _deleteEvent(index),
          onInvite: () async {
            // Handle invite logic
          },
        );
      },
    );
  }




  // Open add event page
  void _openAddEventPage(BuildContext context) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AddOrEditEventPage(
          onSave: (newEvent) {
            _addEvent(newEvent);
          },
        ),
      ),
    );

    if (result == true) {
      _fetchEvents();
    }
  }

  // Open edit event page
  void _openEditEventPage(BuildContext context, int index, Event event) async {
    final result = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => AddOrEditEventPage(
          event: event,
          onSave: (updatedEvent) {
            setState(() {
              _allEvents[index] = updatedEvent; // Update the specific event
            });
            _categorizeEvents(); // Reorganize the tabs
          },
        ),
      ),
    );

    if (result == true) {
      await _fetchEvents(); // Ensure the events list is refreshed
    }
  }


  @override
  void initState() {
    super.initState();
    _loadUserData();
    _fetchEvents();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.red[700],
        title: Text(
          "Events Dashboard",
          style: TextStyle(color: Colors.white),
        ),
        actions: [
          Row(
            children: [
              Text(
                username != null ? "Welcome $username!" : "Loading...",
                style: TextStyle(color: Colors.white, fontSize: 16),
              ),
              SizedBox(width: 8),
              GestureDetector(
                onTapDown: (details) => _showProfileMenu(context, details.globalPosition),
                child: CircleAvatar(
                  backgroundImage: AssetImage('assets/avatar_placeholder.png'),
                  backgroundColor: Colors.grey[300],
                  radius: 18,
                ),
              ),
              SizedBox(width: 16),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          _buildTabBar(),
          Expanded(
            child: _buildEventList(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _openAddEventPage(context),
        backgroundColor: Colors.red[700],
        child: Icon(Icons.add),
      ),
    );
  }
}

class Event {
  final String? id;
  final String title;
  final String description;
  final String location;
  final DateTime dateTime;
  final String organizerId;
  final Map<String, dynamic>? organizer; // Dynamic organizer data
  final List<String> sharedWith;

  Event({
    this.id,
    required this.title,
    required this.description,
    required this.location,
    required this.dateTime,
    required this.organizerId,
    this.organizer,
    required this.sharedWith,
  });


  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['_id'] as String?,
      title: json['title'] as String,
      description: json['description'] as String,
      location: json['location'] ?? '',
      dateTime: DateTime.parse(json['date']),
      organizerId: json['organizerId'] ?? '',
      organizer: json['organizer'], // Extract organizer details dynamically
      sharedWith: List<String>.from(json['sharedWith'] ?? []),
    );
  }
}

