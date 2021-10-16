import { Component, OnInit } from '@angular/core';
import { Document } from '../../models/document';
import { DocumentService } from '../../services/document/document.service';
import { ActivatedRoute, Router } from '@angular/router';
import { flatMap, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { concat } from 'rxjs';
import { DocumentTypeService } from 'src/app/services/document/document-type.service';
@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documents: Document[];
  documentType: string;
  baseUrl: string;
  display: string;

  constructor(private documentService: DocumentService,
    private documentTypeService: DocumentTypeService,
    private route: ActivatedRoute,
    private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.route.params.pipe(
      tap(params => this.documentType = params['document-type']),
      switchMap(_ => this.documentTypeService.getDocumentType(this.documentType)),
      tap(documentType => {
        this.baseUrl  = documentType.folder;
        this.display = documentType.displayName;
      }),
      flatMap(_ => this.documentService.getDocuments(this.documentType))
    ).subscribe(documents => {
      console.log(documents);
      this.documents = documents;
    })
  }
}
