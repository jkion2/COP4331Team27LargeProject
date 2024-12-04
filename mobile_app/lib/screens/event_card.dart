import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'eventDashboard_screen.dart';

class EventCard extends StatelessWidget {
  final Event event;
  final String? userId;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback onInvite;

  EventCard({
    required this.event,
    required this.userId,
    required this.onEdit,
    required this.onDelete,
    required this.onInvite,
  });

  @override
  Widget build(BuildContext context) {
    final organizerName = event.organizer?['username'] ?? 'Unknown'; // Dynamically fetched organizer name
    final isCreator = event.organizerId == userId;

    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: () {
          // Show event details in a pop-up when tapping outside the buttons
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: Text(event.title),
                content: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text("Date: ${DateFormat.yMMMd().add_jm().format(event.dateTime)}"),
                    SizedBox(height: 8),
                    Text("Location: ${event.location}"),
                    SizedBox(height: 8),
                    Text("Description: ${event.description}"),
                    SizedBox(height: 8),
                    Text(
                      "Host: $organizerName", // Dynamically fetched host
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                actions: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: Text("Close"),
                  ),
                ],
              );
            },
          );
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title row with actions (Edit, Delete, Invite)
              Row(
                children: [
                  Expanded(
                    child: Text(
                      event.title,
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (isCreator) // Show Edit button only if the user is the creator
                    IconButton(
                      icon: Icon(Icons.edit, color: Colors.blue),
                      onPressed: onEdit,
                      tooltip: 'Edit Event',
                    ),
                  if (isCreator) // Show Delete button only if the user is the creator
                    IconButton(
                      icon: Icon(Icons.delete, color: Colors.red),
                      onPressed: onDelete,
                      tooltip: 'Delete Event',
                    ),
                  if (isCreator) // Show Send Invite button only if the user is the creator
                    IconButton(
                      icon: Icon(Icons.send, color: Colors.green),
                      onPressed: onInvite,
                      tooltip: 'Send Invite',
                    ),
                ],
              ),
              SizedBox(height: 8),
              // Date and Time row
              Row(
                children: [
                  Icon(Icons.access_time, color: Colors.grey),
                  SizedBox(width: 8),
                  Text(
                    DateFormat.yMMMd().add_jm().format(event.dateTime),
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
              SizedBox(height: 8),
              // Location row
              Row(
                children: [
                  Icon(Icons.location_on, color: Colors.grey),
                  SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      event.location,
                      style: TextStyle(color: Colors.grey),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
              SizedBox(height: 8),
              // Host/Organizer row
              Row(
                children: [
                  Icon(Icons.person, color: Colors.grey),
                  SizedBox(width: 8),
                  Text(
                    "Host: $organizerName", // Dynamically fetched host
                    style: TextStyle(color: Colors.grey),
                  ),
                ],
              ),
              SizedBox(height: 8),
              // Description preview
              Text(
                event.description,
                style: TextStyle(color: Colors.black87),
                maxLines: 3,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
