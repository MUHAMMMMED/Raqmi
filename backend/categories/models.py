from django.db import models

class Stage(models.Model):

    name = models.CharField(max_length=100)  
    ordering = ['name']

    def __str__(self):
        return self.name


class Grade(models.Model):

    stage = models.ForeignKey(Stage, on_delete=models.CASCADE, related_name="grades")
    name = models.CharField(max_length=100) 

    ordering = ['stage__name', 'name']
    unique_together = ['stage', 'name']

    def __str__(self):
        return f" {self.name}"


class Program(models.Model):

    grade = models.ForeignKey(Grade, on_delete=models.CASCADE, related_name="programs")
    name = models.CharField(max_length=100) 

    ordering = ['grade__stage__name', 'grade__name', 'name']
    unique_together = ['grade', 'name']

    def __str__(self):
        return f" {self.name}"

 
class Subject(models.Model):

    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="subjects")
    name = models.CharField(max_length=100)

    ordering = ['program__grade__stage__name', 'program__grade__name', 'program__name', 'name']
    unique_together = ['program', 'name']

    def __str__(self):
        return f" {self.name}"


 