import {
  AfterViewInit,
  Compiler,
  Component,
  ComponentFactory,
  Injector,
  NgModuleFactory,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;
  @ViewChildren('container', { read: ViewContainerRef })
  containerRefs: QueryList<ViewContainerRef>;

  containers: ViewContainerRef[] = [];
  componentFactories: ComponentFactory<any>[];

  componentNames = ['ComponentOne', 'ComponentTwo', 'ComponentThree'];

  constructor(private compiler: Compiler, private injector: Injector) {}

  ngAfterViewInit() {
    this.containers = this.containerRefs.toArray();
  }

  async loadModule1() {
    this.loadModule(await import('./module1/m1.module').then((m) => m.Module1));
  }

  async loadModule2() {
    this.loadModule(await import('./module2/m2.module').then((m) => m.Module2));
  }

  createComponent(factory: ComponentFactory<any>) {
    this.anchor.clear();
    this.anchor.createComponent(factory);
  }

  private loadModule(moduleType: Type<any>) {
    this.anchor.clear();
    const moduleFactories =
      this.compiler.compileModuleAndAllComponentsSync(moduleType);
    this.componentFactories = moduleFactories.componentFactories;

    const emptyContainer = this.getEmptyContainer();
    if (emptyContainer) {
      emptyContainer.createComponent(this.componentFactories[0]);
    }
  }

  private getEmptyContainer(): ViewContainerRef | null {
    return this.containers.find((container) => container.length === 0) || null;
  }
}
