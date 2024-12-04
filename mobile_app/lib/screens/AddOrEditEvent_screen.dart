import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../Services/api_service.dart'; // Import ApiService
import 'eventDashboard_screen.dart'; // Adjust the path if needed for the Event class

class AddOrEditEventPage extends StatefulWidget {
  final Event? event; // Null means adding a new event; non-null means editing.
  final Function(Event) onSave; // Callback to save the event.

  AddOrEditEventPage({this.event, required this.onSave});

  @override
  _AddOrEditEventPageState createState() => _AddOrEditEventPageState();
}

class _AddOrEditEventPageState extends State<AddOrEditEventPage> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _locationController;
  DateTime? _selectedDateTime;
  final ApiService _apiService = ApiService(); // Initialize ApiService

  @override
  void initState() {
    super.initState();
    final event = widget.event;
    _titleController = TextEditingController(text: event?.title ?? "");
    _descriptionController = TextEditingController(text: event?.description ?? "");
    _locationController = TextEditingController(text: event?.location ?? "");
    _selectedDateTime = event?.dateTime;
  }

  void _pickDateTime() async {
    // Pick date
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: _selectedDateTime ?? DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime(2100),
    );

    if (pickedDate == null) return;

    // Pick time
    TimeOfDay? pickedTime = await showTimePicker(
      context: context,
      initialTime: _selectedDateTime != null
          ? TimeOfDay.fromDateTime(_selectedDateTime!)
          : TimeOfDay.now(),
    );

    if (pickedTime == null) return;

    setState(() {
      _selectedDateTime = DateTime(
        pickedDate.year,
        pickedDate.month,
        pickedDate.day,
        pickedTime.hour,
        pickedTime.minute,
      );
    });
  }

  void _saveEvent() async {
    if (_titleController.text.isEmpty || _selectedDateTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Title and Date/Time are required!")),
      );
      return;
    }

    try {
      final organizerName = await _apiService.getUsername(); // Get the organizer's name
      if (organizerName == null || organizerName.isEmpty) {
        throw Exception("Organizer name not found");
      }

      if (widget.event == null) {
        // Creating a new event
        final organizerId = await _apiService.getUserId();
        if (organizerId == null) {
          throw Exception("Organizer ID not found");
        }

        await _apiService.createEvent(
          _titleController.text,
          _descriptionController.text,
          _selectedDateTime!.toIso8601String(),
          organizerId,
          _locationController.text,
        );

        Navigator.pop(context, true); // Signal success for new event
      } else {
        // Editing an existing event
        await _apiService.editEvent(
          widget.event!.id!,
          _titleController.text,
          _descriptionController.text,
          _selectedDateTime!.toIso8601String(),
          _locationController.text,
        );

        // Build updated event with dynamic organizer data.
        final updatedEvent = Event(
          id: widget.event!.id,
          title: _titleController.text,
          description: _descriptionController.text,
          location: _locationController.text,
          dateTime: _selectedDateTime!,
          organizerId: widget.event!.organizerId,
          organizer: widget.event!.organizer, // Use existing organizer data dynamically
          sharedWith: widget.event!.sharedWith,
        );

        // Pass the updated event back to the dashboard
        widget.onSave(updatedEvent);

        Navigator.pop(context, true); // Signal success and navigate back
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Failed to save event: $error")),
      );
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.event == null ? "Add Event" : "Edit Event"),
        backgroundColor: Colors.red[700],
      ),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: ListView(
          children: [
            TextField(
              controller: _titleController,
              decoration: InputDecoration(labelText: "Title"),
            ),
            SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              decoration: InputDecoration(labelText: "Description"),
              maxLines: 3,
            ),
            SizedBox(height: 16),
            TextField(
              controller: _locationController,
              decoration: InputDecoration(labelText: "Location"),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: Text(
                    _selectedDateTime == null
                        ? "No date/time selected"
                        : "Selected: ${DateFormat.yMMMd().add_jm().format(_selectedDateTime!)}",
                    style: TextStyle(color: Colors.grey[700]),
                  ),
                ),
                ElevatedButton(
                  onPressed: _pickDateTime,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red[700],
                  ),
                  child: Text("Pick Date/Time"),
                ),
              ],
            ),
            SizedBox(height: 24),
            ElevatedButton(
              onPressed: _saveEvent,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red[700],
                padding: EdgeInsets.symmetric(vertical: 16),
              ),
              child: Text(
                widget.event == null ? "Add Event" : "Save Changes",
                style: TextStyle(fontSize: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
