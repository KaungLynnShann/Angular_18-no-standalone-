import { Component,OnInit,ViewChild } from '@angular/core';
import { Student } from '../../models/student.model';
import { StudentService } from '../../service/student.service';
import { faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import swal from 'sweetalert2'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent implements OnInit{

  @ViewChild('importFileInput') importFileInput: any;
  
  faTrash = faTrash;
  faClipboard = faUser;

  localDomain = 'http://localhost:8080';

 Search: string = '';
  students?: Student[];
  currentStudent: Student = {};
  currentIndex = -1;
  search= {
    studentId:'',
    studentName :''
  
  }
  constructor(private studentService: StudentService ,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.retrieveStudents();
  };

  retrieveStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (data) => {
        this.students = data;
        // console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
  refreshList(): void {
    this.retrieveStudents();
    this.currentStudent = {};
    this.currentIndex = -1;
  }

  openDeleteDialog(id: number): void {
    const dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.removeStudent(id);
      }
    });
  }

  removeStudent(id: number): void {
    this.studentService.deleteStudent(id).subscribe({
      next: (res) => {
        console.log("student delete successfully",res);
        this.refreshList();
      },
      error: (e) => console.error(e)
    });
  }
  searchTitle(): void {
    this.currentStudent = {};
    this.currentIndex = -1;

    this.studentService.getAllByStudentName(this.Search).subscribe({
      next: (data) => {
        this.students = data;
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
  searchStudentId(id: number): void {
    this.currentStudent = {};
    this.currentIndex = -1;

    this.studentService.getStudentById(id).subscribe({
      next: (data) => {
        this.students = [data];
        console.log(data);
      },
      error: (e) => console.error(e)
    });
  }
  onSearch(): void {
    if (this.Search.trim().length === 0) {
      this.retrieveStudents();
      return;
    }

    if (!isNaN(Number(this.Search))) {
      this.searchStudentId(Number(this.Search));
    } else {
      this.searchTitle();
    }
  }
  exportToExcel(): void {
    if (!this.students || this.students.length === 0) {
      console.error('No data available for export.');
      return;
    }
  
    const data = this.students.map(student => {
      return {
         'Date': student.date,
        'ID': student.studentId,
        'Name': student.studentName,
        'Nrc No': student.studentNrc,
        'Age': student.age,
        'Date of Birth': student.dateOfBirth,
        'Gender': student.gender,
        'Father Name': student.fatherName,
        'Township': student.township,
        'Address': student.address,
        'Photo': student.photo
      };
    });
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    XLSX.writeFile(wb, 'exported_data.xlsx');
  }
  
  triggerFileInput(): void {
    this.importFileInput.nativeElement.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    this.studentService.import(file).subscribe({
      next: (response: any) => {
        console.log(response);
        this.retrieveStudents();
        window.location.reload();
        
         swal.fire({
          icon: 'success',
          title: 'success!',
          text: 'File uploaded successfully',
        });
      },
      error: (error) =>   console.error(error)
    });
  }
}

