# frozen_string_literal: true

module Novabilling
  module Customers
    module Types
      class ListCustomersRequest < Internal::Types::Model
        field :page, -> { Integer }, optional: true, nullable: false
        field :limit, -> { Integer }, optional: true, nullable: false
        field :search, -> { String }, optional: true, nullable: false
        field :country, -> { String }, optional: true, nullable: false
        field :currency, -> { String }, optional: true, nullable: false
        field :sort_by, -> { String }, optional: true, nullable: false, api_name: "sortBy"
        field :sort_order, -> { Novabilling::Customers::Types::ListCustomersRequestSortOrder }, optional: true, nullable: false, api_name: "sortOrder"
      end
    end
  end
end
