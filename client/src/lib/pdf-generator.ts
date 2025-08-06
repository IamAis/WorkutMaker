import jsPDF from 'jspdf';
import type { Workout, CoachProfile } from '@shared/schema';

export class PDFGenerator {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
  }

  async generateWorkoutPDF(workout: Workout, coachProfile?: CoachProfile | null, filename?: string): Promise<Blob> {
    this.doc = new jsPDF();
    let yPosition = this.margin;

    // Header with coach info and logo
    yPosition = this.addHeader(workout, yPosition, coachProfile);
    yPosition += 10;

    // Workout info
    yPosition = this.addWorkoutInfo(workout, yPosition);
    yPosition += 10;

    // Description
    if (workout.description) {
      yPosition = this.addDescription(workout.description, yPosition);
      yPosition += 10;
    }

    // Weekly progression
    yPosition = this.addWeeklyProgression(workout, yPosition);

    // Dietary advice
    if (workout.dietaryAdvice) {
      yPosition = this.addDietaryAdvice(workout.dietaryAdvice, yPosition);
    }

    // Footer with coach contact info
    this.addFooter(coachProfile);

    return this.doc.output('blob');
  }

  downloadPDF(blob: Blob, filename: string, exportPath?: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    
    // If export path is specified, suggest it in the filename
    if (exportPath && exportPath.trim()) {
      a.download = `${exportPath.replace(/\/$/, '')}/${filename}`;
    }
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private addHeader(workout: Workout, yPosition: number, coachProfile?: CoachProfile | null): number {
    // Add logo if present
    if (coachProfile?.logo) {
      try {
        this.doc.addImage(coachProfile.logo, 'JPEG', this.margin, yPosition, 25, 25);
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }
    }

    // Title
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(24);
    this.doc.setTextColor(79, 70, 229); // Indigo color
    this.doc.text('SCHEDA DI ALLENAMENTO', this.pageWidth / 2, yPosition + 10, { align: 'center' });
    yPosition += 25;

    // Subtitle
    this.doc.setFontSize(14);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text(`${workout.workoutType} - ${workout.duration} settimane`, this.pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Coach name if present
    if (coachProfile?.name) {
      this.doc.setFontSize(12);
      this.doc.setTextColor(100, 100, 100);
      this.doc.text(`Coach: ${coachProfile.name}`, this.pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;
    }

    // Line separator
    this.doc.setDrawColor(79, 70, 229);
    this.doc.setLineWidth(1);
    this.doc.line(this.margin, yPosition, this.pageWidth - this.margin, yPosition);
    yPosition += 10;

    return yPosition;
  }

  private addWorkoutInfo(workout: Workout, yPosition: number): number {
    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(12);
    this.doc.setTextColor(0, 0, 0);

    // Coach and client info in two columns
    const midPoint = this.pageWidth / 2;
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('COACH:', this.margin, yPosition);
    this.doc.text('CLIENTE:', midPoint, yPosition);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(workout.coachName, this.margin + 25, yPosition);
    this.doc.text(workout.clientName, midPoint + 30, yPosition);
    yPosition += 10;

    this.doc.setFont('helvetica', 'bold');
    this.doc.text('TIPO:', this.margin, yPosition);
    this.doc.text('DURATA:', midPoint, yPosition);
    
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(workout.workoutType, this.margin + 25, yPosition);
    this.doc.text(`${workout.duration} settimane`, midPoint + 30, yPosition);
    yPosition += 10;

    return yPosition;
  }

  private addDescription(description: string, yPosition: number): number {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(79, 70, 229);
    this.doc.text('DESCRIZIONE', this.margin, yPosition);
    yPosition += 8;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    
    const lines = this.doc.splitTextToSize(description, this.pageWidth - 2 * this.margin);
    this.doc.text(lines, this.margin, yPosition);
    yPosition += lines.length * 5;

    return yPosition;
  }

  private addWeeklyProgression(workout: Workout, yPosition: number): number {
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(79, 70, 229);
    this.doc.text('PROGRESSIONE SETTIMANALE', this.margin, yPosition);
    yPosition += 10;

    for (const week of workout.weeks) {
      // Check if we need a new page
      if (yPosition > this.pageHeight - 80) {
        this.doc.addPage();
        yPosition = this.margin;
      }

      // Week header
      this.doc.setFont('helvetica', 'bold');
      this.doc.setFontSize(12);
      this.doc.setTextColor(0, 0, 0);
      this.doc.text(`SETTIMANA ${week.number}`, this.margin, yPosition);
      yPosition += 8;

      // Week notes
      if (week.notes) {
        this.doc.setFont('helvetica', 'italic');
        this.doc.setFontSize(9);
        const noteLines = this.doc.splitTextToSize(week.notes, this.pageWidth - 2 * this.margin);
        this.doc.text(noteLines, this.margin, yPosition);
        yPosition += noteLines.length * 4;
      }

      // Process each day in the week
      for (const day of week.days) {
        if (yPosition > this.pageHeight - 60) {
          this.doc.addPage();
          yPosition = this.margin;
        }

        // Day header
        this.doc.setFont('helvetica', 'bold');
        this.doc.setFontSize(11);
        this.doc.setTextColor(79, 70, 229);
        this.doc.text(day.name, this.margin + 5, yPosition);
        yPosition += 8;

        // Day notes
        if (day.notes) {
          this.doc.setFont('helvetica', 'italic');
          this.doc.setFontSize(8);
          const dayNoteLines = this.doc.splitTextToSize(day.notes, this.pageWidth - 2 * this.margin - 10);
          this.doc.text(dayNoteLines, this.margin + 10, yPosition);
          yPosition += dayNoteLines.length * 3;
        }

        if (day.exercises.length > 0) {
          // Exercise table headers
          this.doc.setFont('helvetica', 'bold');
          this.doc.setFontSize(8);
          this.doc.setTextColor(0, 0, 0);
          this.doc.text('ESERCIZIO', this.margin + 10, yPosition);
          this.doc.text('SERIE', this.margin + 70, yPosition);
          this.doc.text('REPS', this.margin + 95, yPosition);
          this.doc.text('CARICO', this.margin + 120, yPosition);
          this.doc.text('RECUPERO', this.margin + 150, yPosition);
          yPosition += 5;

          // Line under headers
          this.doc.setDrawColor(200, 200, 200);
          this.doc.setLineWidth(0.3);
          this.doc.line(this.margin + 10, yPosition, this.pageWidth - this.margin - 10, yPosition);
          yPosition += 3;

          // Exercises
          this.doc.setFont('helvetica', 'normal');
          for (const exercise of day.exercises) {
            if (yPosition > this.pageHeight - 30) {
              this.doc.addPage();
              yPosition = this.margin;
            }

            // Add exercise image if present
            if (exercise.imageUrl) {
              try {
                // Add image to PDF (small thumbnail)
                this.doc.addImage(exercise.imageUrl, 'JPEG', this.margin + 5, yPosition - 3, 8, 8);
              } catch (error) {
                console.warn('Could not add exercise image to PDF:', error);
              }
            }

            // Exercise data
            this.doc.text(exercise.name || '', this.margin + (exercise.imageUrl ? 18 : 10), yPosition);
            this.doc.text(exercise.sets || '', this.margin + 70, yPosition);
            this.doc.text(exercise.reps || '', this.margin + 95, yPosition);
            this.doc.text(exercise.load || '', this.margin + 120, yPosition);
            this.doc.text(exercise.rest || '', this.margin + 150, yPosition);
            yPosition += 5;

            // Exercise notes
            if (exercise.notes) {
              this.doc.setFont('helvetica', 'italic');
              this.doc.setFontSize(7);
              const noteLines = this.doc.splitTextToSize(`Note: ${exercise.notes}`, this.pageWidth - 2 * this.margin - 20);
              this.doc.text(noteLines, this.margin + 15, yPosition);
              yPosition += noteLines.length * 3;
              this.doc.setFont('helvetica', 'normal');
              this.doc.setFontSize(8);
            }
          }
        }
        
        yPosition += 8; // Space after each day
      }

      yPosition += 5; // Space after each week
    }

    return yPosition;
  }

  private addDietaryAdvice(advice: string, yPosition: number): number {
    if (yPosition > this.pageHeight - 60) {
      this.doc.addPage();
      yPosition = this.margin;
    }

    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(14);
    this.doc.setTextColor(79, 70, 229);
    this.doc.text('CONSIGLI DIETISTICI', this.margin, yPosition);
    yPosition += 8;

    this.doc.setFont('helvetica', 'normal');
    this.doc.setFontSize(10);
    this.doc.setTextColor(0, 0, 0);
    
    const lines = this.doc.splitTextToSize(advice, this.pageWidth - 2 * this.margin);
    this.doc.text(lines, this.margin, yPosition);

    return yPosition + lines.length * 5;
  }

  private addFooter(coachProfile?: CoachProfile | null): void {
    const footerY = this.pageHeight - 25;
    
    // Coach contact info
    if (coachProfile) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(8);
      this.doc.setTextColor(100, 100, 100);
      
      let contactInfo = [];
      if (coachProfile.email) contactInfo.push(`Email: ${coachProfile.email}`);
      if (coachProfile.phone) contactInfo.push(`Tel: ${coachProfile.phone}`);
      if (coachProfile.instagram) {
        const instagram = coachProfile.instagram.startsWith('@') || coachProfile.instagram.startsWith('http') 
          ? coachProfile.instagram 
          : `@${coachProfile.instagram}`;
        contactInfo.push(`Instagram: ${instagram}`);
      }
      if (coachProfile.facebook) {
        contactInfo.push(`Facebook: ${coachProfile.facebook}`);
      }
      if (coachProfile.website) {
        const website = coachProfile.website.startsWith('http') 
          ? coachProfile.website 
          : `https://${coachProfile.website}`;
        contactInfo.push(`Web: ${website}`);
      }
      
      if (contactInfo.length > 0) {
        const contactText = contactInfo.join(' • ');
        const lines = this.doc.splitTextToSize(contactText, this.pageWidth - 2 * this.margin);
        this.doc.text(lines, this.pageWidth / 2, footerY, { align: 'center' });
      }
    }
    
    // Generation info
    this.doc.setFont('helvetica', 'italic');
    this.doc.setFontSize(8);
    this.doc.setTextColor(150, 150, 150);
    this.doc.text('Generato con FitTracker Pro', this.margin, footerY + 10);
    this.doc.text(new Date().toLocaleDateString('it-IT'), this.pageWidth - this.margin, footerY + 10, { align: 'right' });
  }
}

export const pdfGenerator = new PDFGenerator();
