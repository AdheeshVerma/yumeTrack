import tkinter as tk
from tkinter import messagebox, Toplevel, ttk
import smtplib
from email.mime.text import MIMEText
import csv
import os
from datetime import datetime


def process_items(action, rno, items_list):
    sender_email = "r36491566@gmail.com"
    receiver_email = "aryan4512.ece24@chitkara.edu.in"
    password = "iqhk kgze yhco mxrh"  

    items_text = "\n".join([f" - {name} : {qty}" for name, qty in items_list])
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    subject = f"Smart Entry System - Items {action}"
    body = f"""
📌 Smart Entry System Notification

Roll Number : {rno}
Items {action}:
{items_text}

Date & Time : {timestamp}

This is an automated notification from the Smart Entry System.
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

    try:
        # --- Send Email ---
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, msg.as_string())

        # --- Save to CSV ---
        file_exists = os.path.isfile("issued_items.csv")
        with open("issued_items.csv", "a", newline="") as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["DateTime", "Roll Number", "Item Name", "Quantity", "Action"])
            for name, qty in items_list:
                writer.writerow([timestamp, rno, name, qty, action])

        messagebox.showinfo("Success", f"✅ Items {action} and saved to CSV!")

    except Exception as e:
        messagebox.showerror("Error", f"❌ Failed\n{e}")


# --- Custom Button Class ---
class ModernButton(tk.Button):
    def __init__(self, parent, **kwargs):
        super().__init__(parent, **kwargs)
        self.configure(
            relief="flat",
            bd=0,
            cursor="hand2",
            font=("Segoe UI", 12, "bold")
        )
        self.bind("<Enter>", self.on_hover)
        self.bind("<Leave>", self.on_leave)
        self.original_color = kwargs.get('bg', '#3498db')
        
    def on_hover(self, event):
        self.configure(bg=self.lighten_color(self.original_color))
        
    def on_leave(self, event):
        self.configure(bg=self.original_color)
        
    def lighten_color(self, color):
        # Simple color lightening - you could make this more sophisticated
        color_map = {
            '#3498db': '#5dade2',  # Blue
            '#e74c3c': '#f1948a',  # Red
            '#2ecc71': '#58d68d',  # Green
            '#f39c12': '#f7c52d',  # Orange
            '#9b59b6': '#bb8fce',  # Purple
            '#1abc9c': '#52c4a3'   # Teal
        }
        return color_map.get(color, '#5dade2')


# --- Item Form Window ---
def item_form(action):
    form = Toplevel(root)
    form.title(f"{action} Items")
    form.geometry("480x650")
    form.configure(bg="#f8fafc")
    form.resizable(False, False)
    
    # Add window icon effect
    form.attributes('-topmost', True)
    form.after(100, lambda: form.attributes('-topmost', False))

    # Header with gradient effect
    header_frame = tk.Frame(form, bg="#2c3e50", height=80)
    header_frame.pack(fill="x")
    header_frame.pack_propagate(False)
    
    action_color = "#e74c3c" if action == "RETURNED" else "#3498db"
    icon = "🔄" if action == "RETURNED" else "📦"
    
    header_label = tk.Label(header_frame, text=f"{icon} {action} Items", 
                           font=("Segoe UI", 20, "bold"), 
                           bg="#2c3e50", fg="white")
    header_label.pack(expand=True)

    # Main content frame
    main_frame = tk.Frame(form, bg="#f8fafc")
    main_frame.pack(pady=30, padx=30, fill="both", expand=True)

    # Roll Number Section
    roll_section = tk.Frame(main_frame, bg="#ffffff", relief="flat", bd=1)
    roll_section.pack(fill="x", pady=(0, 20))
    
    tk.Label(roll_section, text="🎓 Roll Number", font=("Segoe UI", 12, "bold"), 
             bg="#ffffff", fg="#2c3e50").pack(anchor="w", padx=20, pady=(15, 5))
    
    entry_roll = tk.Entry(roll_section, font=("Segoe UI", 11), bd=0, relief="flat",
                         bg="#f1f3f4", fg="#2c3e50", insertbackground="#3498db")
    entry_roll.pack(fill="x", padx=20, pady=(0, 15), ipady=8)

    # Items Count Section
    items_section = tk.Frame(main_frame, bg="#ffffff", relief="flat", bd=1)
    items_section.pack(fill="x", pady=(0, 20))
    
    tk.Label(items_section, text="🔢 Number of Items", font=("Segoe UI", 12, "bold"),
             bg="#ffffff", fg="#2c3e50").pack(anchor="w", padx=20, pady=(15, 5))
    
    entry_items = tk.Entry(items_section, font=("Segoe UI", 11), bd=0, relief="flat",
                          bg="#f1f3f4", fg="#2c3e50", insertbackground="#3498db")
    entry_items.pack(fill="x", padx=20, pady=(0, 15), ipady=8)

    # Dynamic items frame
    items_container = tk.Frame(main_frame, bg="#f8fafc")
    items_container.pack(fill="both", expand=True)
    
    # Scrollable frame for items
    canvas = tk.Canvas(items_container, bg="#f8fafc", highlightthickness=0)
    scrollbar = ttk.Scrollbar(items_container, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#f8fafc")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    entries_name = []
    entries_qty = []

    def create_item_entries():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()
        entries_name.clear()
        entries_qty.clear()

        try:
            num = int(entry_items.get())
            if num <= 0:
                raise ValueError("Number must be positive")
        except:
            messagebox.showerror("Error", "⚠️ Please enter a valid positive number!")
            return

        for i in range(num):
            # Item frame
            item_frame = tk.Frame(scrollable_frame, bg="#ffffff", relief="flat", bd=1)
            item_frame.pack(fill="x", pady=8, padx=5)
            
            # Item header
            tk.Label(item_frame, text=f"📋 Item {i+1}", font=("Segoe UI", 11, "bold"),
                    bg="#ffffff", fg="#34495e").pack(anchor="w", padx=20, pady=(10, 5))
            
            # Name and Quantity in same row
            row_frame = tk.Frame(item_frame, bg="#ffffff")
            row_frame.pack(fill="x", padx=20, pady=(0, 15))
            
            # Name field
            name_frame = tk.Frame(row_frame, bg="#ffffff")
            name_frame.pack(side="left", fill="x", expand=True, padx=(0, 10))
            tk.Label(name_frame, text="Name:", font=("Segoe UI", 9), bg="#ffffff", fg="#7f8c8d").pack(anchor="w")
            e_name = tk.Entry(name_frame, font=("Segoe UI", 10), bd=0, relief="flat",
                             bg="#f1f3f4", fg="#2c3e50", insertbackground="#3498db")
            e_name.pack(fill="x", ipady=6)
            entries_name.append(e_name)

            # Quantity field
            qty_frame = tk.Frame(row_frame, bg="#ffffff")
            qty_frame.pack(side="right", fill="x", expand=True)
            tk.Label(qty_frame, text="Quantity:", font=("Segoe UI", 9), bg="#ffffff", fg="#7f8c8d").pack(anchor="w")
            e_qty = tk.Entry(qty_frame, font=("Segoe UI", 10), bd=0, relief="flat",
                            bg="#f1f3f4", fg="#2c3e50", insertbackground="#3498db")
            e_qty.pack(fill="x", ipady=6)
            entries_qty.append(e_qty)

        # Show canvas and scrollbar if needed
        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

    def submit_items():
        rno = entry_roll.get().strip()
        if not rno:
            messagebox.showerror("Error", "⚠️ Please enter roll number!")
            return
            
        try:
            num_items = int(entry_items.get())
        except:
            messagebox.showerror("Error", "⚠️ Please enter valid number of items!")
            return

        items_list = []
        for i in range(num_items):
            item_name = entries_name[i].get().strip()
            quantity = entries_qty[i].get().strip()
            if not item_name or not quantity:
                messagebox.showerror("Error", f"⚠️ Please fill all fields for Item {i+1}!")
                return
            items_list.append((item_name, quantity))

        process_items(action, rno, items_list)
        form.destroy()

    # Buttons frame
    btn_frame = tk.Frame(main_frame, bg="#f8fafc")
    btn_frame.pack(fill="x", pady=20)

    # Add Items Button
    add_btn = ModernButton(btn_frame, text="➕ Generate Item Fields", command=create_item_entries,
                          bg="#f39c12", fg="white", width=20, height=2)
    add_btn.pack(pady=5)

    # Submit Button
    submit_btn = ModernButton(btn_frame, text=f"✅ {action.title()} Items", command=submit_items,
                             bg=action_color, fg="white", width=20, height=2)
    submit_btn.pack(pady=5)


# --- View Logs ---
def view_logs():
    if not os.path.isfile("issued_items.csv"):
        messagebox.showinfo("Logs", "📄 No records found yet.")
        return

    log_win = Toplevel(root)
    log_win.title("System Logs")
    log_win.geometry("800x500")
    log_win.configure(bg="#f8fafc")
    log_win.resizable(True, True)

    # Header
    header_frame = tk.Frame(log_win, bg="#34495e", height=70)
    header_frame.pack(fill="x")
    header_frame.pack_propagate(False)
    
    tk.Label(header_frame, text="📊 System Logs & History", 
             font=("Segoe UI", 18, "bold"), bg="#34495e", fg="white").pack(expand=True)

    # Content frame
    content_frame = tk.Frame(log_win, bg="#ffffff")
    content_frame.pack(fill="both", expand=True, padx=20, pady=20)

    # Text widget with scrollbar
    text_frame = tk.Frame(content_frame, bg="#ffffff")
    text_frame.pack(fill="both", expand=True)
    
    text_box = tk.Text(text_frame, wrap="none", font=("Consolas", 10), 
                       bg="#ffffff", fg="#2c3e50", bd=0, relief="flat",
                       selectbackground="#3498db", selectforeground="white")
    
    v_scrollbar = ttk.Scrollbar(text_frame, orient="vertical", command=text_box.yview)
    h_scrollbar = ttk.Scrollbar(text_frame, orient="horizontal", command=text_box.xview)
    
    text_box.configure(yscrollcommand=v_scrollbar.set, xscrollcommand=h_scrollbar.set)
    
    text_box.grid(row=0, column=0, sticky="nsew")
    v_scrollbar.grid(row=0, column=1, sticky="ns")
    h_scrollbar.grid(row=1, column=0, sticky="ew")
    
    text_frame.grid_rowconfigure(0, weight=1)
    text_frame.grid_columnconfigure(0, weight=1)

    # Load and display CSV data
    with open("issued_items.csv", "r") as f:
        rows = f.readlines()

    for i, row in enumerate(rows):
        if i == 0:  # Header row
            text_box.insert("end", row, "header")
        else:
            text_box.insert("end", row)
    
    # Configure tags for better formatting
    text_box.tag_configure("header", font=("Consolas", 10, "bold"), foreground="#e74c3c")
    text_box.configure(state="disabled")


# --- Main GUI ---
root = tk.Tk()
root.title("Smart Entry System")
root.geometry("500x600")
root.configure(bg="#ecf0f1")
root.resizable(False, False)

# Try to set window icon (optional)
try:
    root.iconbitmap("icon.ico")  # Add icon if available
except:
    pass

# Header with modern design
header_frame = tk.Frame(root, bg="#2c3e50", height=100)
header_frame.pack(fill="x")
header_frame.pack_propagate(False)

header_title = tk.Label(header_frame, text="🎓 Smart Entry System", 
                       font=("Segoe UI", 24, "bold"), bg="#2c3e50", fg="white")
header_title.pack(expand=True)

subtitle = tk.Label(header_frame, text="Efficient Item Management Solution", 
                   font=("Segoe UI", 11, "italic"), bg="#2c3e50", fg="#bdc3c7")
subtitle.pack()

# Main content area
main_content = tk.Frame(root, bg="#ecf0f1")
main_content.pack(fill="both", expand=True, pady=40)

# Buttons container
btn_container = tk.Frame(main_content, bg="#ecf0f1")
btn_container.pack(expand=True)

# Modern buttons with spacing
issue_btn = ModernButton(btn_container, text="📦 Issue Items", 
                        command=lambda: item_form("ISSUED"),
                        width=25, height=3, bg="#3498db", fg="white")
issue_btn.pack(pady=15)

return_btn = ModernButton(btn_container, text="🔄 Return Items", 
                         command=lambda: item_form("RETURNED"),
                         width=25, height=3, bg="#e74c3c", fg="white")
return_btn.pack(pady=15)

logs_btn = ModernButton(btn_container, text="📊 View Logs", 
                       command=view_logs,
                       width=25, height=3, bg="#2ecc71", fg="white")
logs_btn.pack(pady=15)

# Footer
footer_frame = tk.Frame(root, bg="#34495e", height=50)
footer_frame.pack(fill="x", side="bottom")
footer_frame.pack_propagate(False)

footer_label = tk.Label(footer_frame, text="© 2025 Smart Entry System | Designed for Excellence", 
                       font=("Segoe UI", 9, "italic"), bg="#34495e", fg="#95a5a6")
footer_label.pack(expand=True)

# Start the application
if __name__ == "__main__":
    root.mainloop()