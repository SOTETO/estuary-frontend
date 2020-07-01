import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { BaseWorkshop } from "@/shared/models/BaseWorkshop.model";
import { Workshop } from "@/shared/models/Workshop.model";
import { Place } from "@/shared/models/Place.model";
import store from "@/store";
import { WorkshopContent } from "@/shared/models/WorkshopContent.model";
import { ProblemStatementWorkshopContent } from "@/shared/models/ProblemStatementWorkshopContent.model";
import { ProblemStatement } from '@/shared/models/ProblemStatement.model';

@Module({ dynamic: true, store, name: "WorkshopStore" })
export default class WorkshopStore extends VuexModule {
  private allWorkshops: BaseWorkshop[] = [];
  private filterQuery: (string | number)[] = [];
  private selectedFullWorkshop: (Workshop<WorkshopContent> | null) = null;

  get workshops(): BaseWorkshop[] {
    return this.allWorkshops;
  }

  get filteredWorkshops(): BaseWorkshop[] {
    if (this.filterQuery.length == 0) return this.workshops;
    return this.allWorkshops.filter(ws => {
      return this.filterQuery.every(query => {
        let res = false;
        if (typeof query === "string") {
          res =
            ws.type.toLowerCase().includes(query.toLowerCase()) ||
            ws.place.name.toLowerCase().includes(query.toLowerCase()) ||
            ws.tags.some(tag =>
              tag.toLowerCase().includes(query.toLowerCase())
            );
        } else {
          const wsDate = new Date(ws.date);
          const queryDate = new Date(query);
          res =
            wsDate.getFullYear() == queryDate.getFullYear() &&
            wsDate.getMonth() == queryDate.getMonth();
        }
        return res;
      });
    });
  }

  get matchingQueries() {
    return (query: string): string[] => {
      const possibleQueries: string[] = [];
      this.allWorkshops.forEach(ws => {
        if (ws.type.toLowerCase().includes(query.toLowerCase())) {
          possibleQueries.push(ws.type);
        }
        if (ws.place.name.toLowerCase().includes(query.toLowerCase())) {
          possibleQueries.push(ws.place.name);
        }
        possibleQueries.push(
          ...ws.tags.filter(tag =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
        );
      });
      return [...new Set(possibleQueries)]; // remove duplicates
    };
  }

  get selectedWorkshop(): Workshop<WorkshopContent> {
    return this.selectedFullWorkshop!;
  }

  @Mutation
  private setSelectedWorkshop(workshop: Workshop<WorkshopContent>) {
    this.selectedFullWorkshop = workshop;
  }

  @Action
  public async selectWorkshop(id: number): Promise<boolean> {
    // TODO: get the workshop with that id from the backend

    // mock data for now
    const foundWorkshop = this.workshops.find(item => item!.id == id);
    if (typeof foundWorkshop !== "undefined") {
      const ws = new Workshop<WorkshopContent>(
        foundWorkshop.id,
        foundWorkshop.type,
        foundWorkshop.place,
        foundWorkshop.date,
        foundWorkshop.tags,
        foundWorkshop.upvotes,
        foundWorkshop.teaser,
        ["Anna", "Paul"],
        "public",
        new ProblemStatementWorkshopContent(
          [
            new ProblemStatement(1, 456, "Supporter", "dass was passiert", "es passiert nichts", "Gründe", "traurig", []),
            new ProblemStatement(2, 245, "Supporter", "dass was passiert", "es passiert nichts", "Gründe", "traurig", []),
            new ProblemStatement(3, 49, "Supporter", "dass was passiert", "es passiert nichts", "Gründe", "traurig", [])
          ]
        )
      );
      this.setSelectedWorkshop(ws);
      return true;
    }
    else
    {
      return false;
    }
  }

  @Mutation
  public setFilter(query: (string | number)[]) {
    this.filterQuery = query;
  }

  @Mutation
  public addFilter(query: string | number) {
    if (!this.filterQuery.includes(query)) {
      this.filterQuery.push(query);
    }
  }

  @Mutation
  public removeFilter(query: string | number) {
    const index = this.filterQuery.indexOf(query);
    if (index > -1) {
      this.filterQuery.splice(index, 1);
    }
  }

  @Mutation
  public addWorkshop(workshop: BaseWorkshop) {
    this.allWorkshops.push(workshop);
  }

  @Action
  public createTestData() {
    this.addWorkshop(
      new BaseWorkshop(
        24,
        "PS Workshop",
        new Place("Hamburg", "https://goo.gl/maps/mbnen1jr8C81J6vU9"),
        1592212009205,
        ["gelb", "blau", "grün", "rot"],
        987,
        "Ein Workshop teaser."
      )
    );
    this.addWorkshop(
      new BaseWorkshop(
        1,
        "PS Workshop",
        new Place("Berlin"),
        1592314101605,
        ["abcd", "fghi", "poiu"],
        37,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ut facilisis metus. Mauris viverra ipsum in sollicitudin porttitor. Aliquam semper dolor ante, eget pellentesque arcu malesuada a."
      )
    );
    this.addWorkshop(
      new BaseWorkshop(
        33,
        "Idea Workshop",
        new Place("Berlin", "https://goo.gl/maps/TS79zqdFXi2tsekE6"),
        1591316104625,
        ["hjk", "sdf"],
        87,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      )
    );
    this.addWorkshop(
      new BaseWorkshop(
        31,
        "Idea Workshop",
        new Place("Berlin", "https://goo.gl/maps/TS79zqdFXi2tsekE6"),
        1291316104625,
        [
          "asdads",
          "asdasd",
          "iuiu",
          "uahduiasdojasd",
          "uhjoj",
          "iuoijoi",
          "ijojoi",
          "jiuhjiu"
        ],
        87,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      )
    );
    this.addWorkshop(
      new BaseWorkshop(
        93,
        "Idea Workshop",
        new Place("Berlin", "https://goo.gl/maps/TS79zqdFXi2tsekE6"),
        1191316104625,
        ["hjk", "sdf", "iuoi", "ioo easda asdasd"],
        87,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      )
    );
  }
}
