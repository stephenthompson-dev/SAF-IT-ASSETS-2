from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

# Create your models here.

class Category(models.Model):
    category_name = models.CharField(max_length=100)

    def __str__(self):
        return self.category_name

class Asset(models.Model):
    asset_name = models.CharField(max_length=100)
    purchase_date = models.DateField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="assets")

    def __str__(self):
        return self.asset_name

class Request(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="requests")
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="requests")
    for_date = models.DateField()
    end_date = models.DateField(blank=True, null=True) # will have no end date if further notice is checked
    further_notice = models.BooleanField(default=False)
    # attributes below are populated by an admin after a request is made.  
    approved = models.BooleanField(default=False)
    approved_date = models.DateField(blank=True, null=True)
    approved_by = models.ForeignKey(User, related_name="approvals", blank=True, null=True, on_delete=models.PROTECT) # need to protect deletion of user if they have approved a request, a request will be delted once the assignment has been marked as returned.
    
    def __str__(self):
        return f'Request for {self.asset} by {self.user}'

    def clean(self):
        # If further_notice is checked, set end_date to None
        if self.further_notice and self.end_date is not None:
            self.end_date = None
        
        # If further_notice is not checked, ensure an end_date is set
        if not self.further_notice and self.end_date is None:
            raise ValidationError('End date must be set if "further_notice" is unchecked.')

        super().clean()  # Call the parent class's clean method to ensure base model validation is still executed due to override

class Assignment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="assignments")
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name="assignments")
    request = models.ForeignKey(Request, on_delete=models.CASCADE, related_name="assignments")
    assignment_date = models.DateField()
    return_date = models.DateField(blank=True, null=True)
    returned = models.BooleanField(default=False)
    
    def __str__(self):
        return f'Assignment of {self.asset} to {self.user}'

