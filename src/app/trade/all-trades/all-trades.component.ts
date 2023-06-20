import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TradeDTO } from 'shared';
import { TradeService } from '../trade.service';
import { UiService } from 'ui';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  dateValidator,
  formDatesValidation,
  formQuantityValidation,
  postiveNumber,
} from './trade.validators';

@Component({
  selector: 'app-all-trades',
  templateUrl: './all-trades.component.html',
  styleUrls: ['./all-trades.component.css'],
})
export class AllTradesComponent implements OnInit, OnDestroy {
  tradeTable: FormGroup;
  control: FormArray;
  touchedRows: TradeDTO[] = [];
  allTradesSub: Subscription | undefined;
  deleteTradeSub: Subscription | undefined;
  createradeSub: Subscription | undefined;
  updateTradeSub: Subscription | undefined;

  alerts = this.uiService.alerts;
  isLoading = false;
  isEditableModeOn: boolean = false;

  constructor(
    private tradeService: TradeService,
    private uiService: UiService,
    private fb: FormBuilder
  ) {
    this.tradeTable = this.fb.group({
      tableRows: this.fb.array([]),
    });

    this.control = this.tradeTable.get('tableRows') as FormArray;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.allTradesSub = this.tradeService.getAllTrades().subscribe({
      next: (resp) => {
        this.addAllTrades(resp);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  onAlertDismiss(index: number) {
    this.uiService.alertDismiss(index);
  }

  initiateForm(): FormGroup {
    return this.fb.group(
      {
        id: [''],
        companyName: [''],
        ticker: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(5),
          ],
        ],
        buyDate: ['', [Validators.required, dateValidator()]],
        buyQuantity: ['', [Validators.required, postiveNumber()]],
        buyPrice: ['', [Validators.required, postiveNumber()]],
        position: [
          '',
          [Validators.required, Validators.pattern('(LONG|SHORT)')],
        ],
        sellDate: ['', dateValidator()],
        sellQuantity: ['', [postiveNumber()]],
        sellPrice: ['', postiveNumber()],
        isEditable: [true],
        isCreated: [true],
      },
      { validators: [formDatesValidation(), formQuantityValidation()] }
    );
  }

  addRow() {
    this.control.insert(0, this.initiateForm());
  }

  onDelete(group: AbstractControl, index: number) {
    this.isLoading = true;
    this.deleteTradeSub = this.tradeService
      .deleteTrade(group.get('id')?.value)
      .subscribe({
        next: (res) => {
          this.control.removeAt(index);

          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          group.get('isEditable')?.setValue(false);
        },
      });
  }

  onEdit(group: AbstractControl) {
    group.get('isEditable')?.setValue(true);
  }

  onCancelEdit(group: AbstractControl, index: number) {
    if (group.get('isCreated')?.value) {
      this.control.removeAt(index);
    } else {
      group.get('isEditable')?.setValue(false);
    }
  }

  onSend(group: AbstractControl) {
    this.isLoading = true;
    if (!group.valid) {
      this.tradeService.showRowValidationErrors(group);
      return;
    }

    if (group.get('isCreated')?.value) {
      this.createradeSub = this.tradeService
        .createTrade(this.mapToDTO(group))
        .subscribe({
          next: (res: TradeDTO) => {
            group.get('id')?.setValue(res.id);
            group.get('isEditable')?.setValue(false);
            group.get('isCreated')?.setValue(false);
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            group.get('isEditable')?.setValue(false);
          },
        });
    } else {
      this.updateTradeSub = this.tradeService
        .updateTrade(this.mapToDTO(group))
        .subscribe({
          next: (res) => {
            group.get('id')?.setValue(res.id);
            group.get('isEditable')?.setValue(false);
            group.get('isCreated')?.setValue(false);
            this.isLoading = false;
          },
          error: (err) => {
            this.isLoading = false;
            group.get('isEditable')?.setValue(false);
            group.get('isCreated')?.setValue(false);
          },
        });
    }
  }

  addAllTrades(dtoList: TradeDTO[]) {
    dtoList.map((dto) => this.control.push(this.mapToFormGroup(dto)));
  }

  mapToFormGroup(tradeDTO: TradeDTO): FormGroup {
    return this.fb.group(
      {
        id: [tradeDTO.id],
        companyName: [tradeDTO.companyName],
        ticker: [
          tradeDTO.ticker,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(5),
          ],
        ],
        buyDate: [tradeDTO.buyDate, [Validators.required, dateValidator()]],
        buyQuantity: [
          tradeDTO.buyQuantity,
          [Validators.required, postiveNumber()],
        ],
        buyPrice: [tradeDTO.buyPrice, [Validators.required, postiveNumber()]],
        position: [
          tradeDTO.position,
          [Validators.required, Validators.pattern('(LONG|SHORT)')],
        ],
        sellDate: [tradeDTO.sellDate, dateValidator()],
        sellQuantity: [tradeDTO.sellQuantity, postiveNumber()],
        sellPrice: [tradeDTO.sellPrice, postiveNumber()],
        isEditable: [false],
        isCreated: [false],
      },
      { validators: [formDatesValidation(), formQuantityValidation()] }
    );
  }

  mapToDTO(group: AbstractControl) {
    return group.value as TradeDTO;
  }

  winLoseOrOpenTrade(group: AbstractControl) {
    if (!group.get('buyPrice')?.value && !group.get('sellPrice')?.value) {
      return '';
    }
    if (!group.get('sellPrice')?.value) {
      return 'table-warning';
    } else if (group.get('sellPrice')?.value === group.get('buyPrice')?.value) {
      return 'table-light';
    } else if (group.get('position')?.value === 'LONG') {
      return group.get('sellPrice')?.value > group.get('buyPrice')?.value
        ? 'table-success'
        : 'table-danger';
    } else if (group.get('position')?.value === 'SHORT') {
      return group.get('buyPrice')?.value > group.get('sellPrice')?.value
        ? 'table-success'
        : 'table-danger';
    }
    return 'table-light';
  }

  ngOnDestroy() {
    this.allTradesSub?.unsubscribe;
    this.createradeSub?.unsubscribe;
    this.deleteTradeSub?.unsubscribe;
    this.updateTradeSub?.unsubscribe;
  }
}
